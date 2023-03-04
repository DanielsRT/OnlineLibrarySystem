const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const database = require('./database');

const users = database.execute('select * from users', (err,result) => {
    if (err) throw err;
    return result;
});

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index.ejs', {name:'Tom'});
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', (req, res) => {

});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var username = req.body.username;
        var isAdmin = false;
        var query = 
        `INSERT INTO Users (username, password, last_name, first_name, isAdmin) VALUES
        ("${username}","${password}","${last_name}","${first_name}",${isAdmin})
        `;
        database.execute(query);
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
    console.log(users);
});

app.listen(3000);