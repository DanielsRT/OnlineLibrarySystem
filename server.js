if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const database = require('./database');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');

const users = database.execute("select * from users ", (err,result) => {
    if (err) throw err;
    var users = JSON.parse(JSON.stringify(result));
    initializePassport(
        passport,
        username => users.find(user => user.username === username),
        user_id => users.find(user => user.user_id === user_id)
    );
    return users;
});

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

app.get('/login', checkNotAuthenticated, (req, res) => {
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
        var isAdmin = false;
        var query = 
        `INSERT INTO Users (username, password, last_name, first_name, isAdmin) VALUES
        ("${username}","${hashedPassword}","${last_name}","${first_name}",${isAdmin})
        `;
        database.execute(query, (err) => {
            if (err) throw err;
            res.redirect('/login');
        });
        
    } catch {
        res.redirect('/register');
    }
});

app.get('/account', checkAuthenticated, (req, res) => {
    res.render('account.ejs');
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

app.listen(3000);