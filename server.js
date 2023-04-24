if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const bcrypt = require('bcrypt');
const database = require('./database').pool;
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
const getUsers = require('./database').getUsers;
const getCatalog = require('./database').getCatalog;
const getItem = require('./database').getItem;
const getUserLoans = require('./database').getUserLoans;

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.first_name});
});

app.get('/login', checkNotAuthenticated, async (req, res) => {
    var users = await getUsers();
    initializePassport(
        passport,
        username => users.find(user => user.username === username),
        user_id => users.find(user => user.user_id === user_id)
    );
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var username = req.body.username;
        var email = req.body.email;
        var phone = req.body.phone;
        var isAdmin = false;
        var query = 
        `INSERT INTO Users (phone, email, username, password, last_name, first_name, isAdmin) VALUES
        ("${phone}","${email}","${username}","${hashedPassword}","${last_name}","${first_name}",${isAdmin})
        `;
        database.query(query);
        res.redirect('/login');
        
    } catch {
        res.redirect('/register');
    }
});

app.get('/account', checkAuthenticated, (req, res) => {
    res.render('account.ejs',{user: req.user});
});

app.get('/account/edit', checkAuthenticated, (req, res) => {
    res.render('account-edit.ejs');
});

app.get('/loans', checkAuthenticated, async (req, res) => {
    var loans = await getUserLoans();
    var items = [];
    loans.forEach(element => {
        if (element.user_id == req.user.user_id) {
            items.push(element);
        }
    });
    
    res.render('loans.ejs',{items: items});
});

app.post('/account/edit', checkAuthenticated, (req, res) => {
    try {
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var username = req.body.username;
        var phone = req.body.phone;
        var email = req.body.email;
        if(first_name != "") {
            var query = `UPDATE users SET first_name = "${first_name}" WHERE user_id = ${req.user.user_id}`;
            database.query(query);
            req.user.first_name = first_name;
        }
        if(last_name != "") {
            var query = `UPDATE users SET last_name = "${last_name}" WHERE user_id = ${req.user.user_id}`;
            database.query(query);
            req.user.last_name = last_name;
        }
        if(username != "") {
            var query = `UPDATE users SET username = "${username}" WHERE user_id = ${req.user.user_id}`;
            database.query(query);
            req.user.username = username;
        }
        if(email != "") {
            var query = `UPDATE users SET email = "${email}" WHERE user_id = ${req.user.user_id}`;
            database.query(query);
            req.user.email = email;
        }
        if(phone != "") {
            var query = `UPDATE users SET phone = "${phone}" WHERE user_id = ${req.user.user_id}`;
            database.query(query);
            req.user.phone = phone;
        }
        res.redirect('/account');
    } catch {
        res.redirect('/account');
    }
});

app.get('/catalog', checkAuthenticated, async (req, res) => {
    var catalog = await getCatalog();
    res.render('catalog.ejs',{catalog: catalog, user: req.user});
});

app.post('/catalog', checkAuthenticated, async (req, res) => {
    var catalog = await getCatalog();
    var searchResults = [];
    catalog.forEach(element => {
        if (element.title.toLowerCase().includes(req.body.userQuery.toLowerCase())) {
            searchResults.push(element);
        }
        if (element.author.toLowerCase().includes(req.body.userQuery.toLowerCase())) {
            searchResults.push(element);
        }
        if (element.publisher.toLowerCase().includes(req.body.userQuery.toLowerCase())) {
            searchResults.push(element);
        }
        if (element.type.toLowerCase().includes(req.body.userQuery.toLowerCase())) {
            searchResults.push(element);
        }
    });
    searchResults = [...new Set(searchResults)];
    
    res.render('catalog-results.ejs',{
        isAdmin: req.user.isAdmin,
        userQuery: req.body.userQuery,
        searchResults: searchResults
    });
});

app.get('/catalog/edit', checkAuthenticated, async (req, res) => {
    var item = await getItem(req.query.accession);
    res.render('catalog-edit.ejs',{item: item});
});

app.post('/catalog/edit', checkAuthenticated, (req, res) => {
    try {
        var title = req.body.title;
        var author = req.body.author;
        var date = req.body.date;
        var type = req.body.type;
        var publisher = req.body.publisher;
        var isbn = req.body.isbn;
        var doi = req.body.doi;
        var accession = req.body.accession;

        var query = `UPDATE catalog SET title = "${title}", author = "${author}", date = "${date}", type = "${type}", publisher = "${publisher}", isbn = "${isbn}", doi = "${doi}" WHERE accession = "${accession}"`;

        database.query(query);
        res.redirect('/catalog');
    } catch {
        res.redirect('/catalog');
    }
    
});

app.get('/catalog/confirmation', checkAuthenticated, async (req, res) => {
    var item = await getItem(req.query.accession);
    res.render('catalog-confirm.ejs',{item: item});
});

app.post('/catalog/confirmation', checkAuthenticated, (req, res) => {
    try {
        var accession = req.body.accession;
        var user_id = req.user.user_id;
        var title = req.body.title;
        var author = req.body.author;
        var checkout_date = new Date();
        var return_date = new Date(checkout_date.setMonth(checkout_date.getMonth()+8));
        
        var loan_query = 
        `insert into loans (accession, checkout_date, return_date, user_id) values` +
        `("${accession}","${checkout_date}","${return_date}",${user_id})`
        var transaction_query = 
        `insert into transactions (date, accession, user_id) values` +
        `("${checkout_date}", "${accession}",${user_id})`
        database.query(loan_query);
        database.query(transaction_query);
        
        res.redirect('/catalog');
    } catch {
        res.redirect('/catalog');
    }
});

app.delete('/logout', (req, res) => {
    req.logOut(function(err) {
        if (err) { return next(err); }
      });
    res.redirect('/login');
});

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app);

sslServer.listen(3000, () => console.log('Secure server on port 3000'));