const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const database = require('./database').pool;

function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = getUserByUsername(username);
        if (user == null) {
            return done(null, false, {message: 'No user with that username'});
        }
        var hashedPassword = user.password;
        try {
            if (await bcrypt.compare(password, hashedPassword)) {
                var date = formatDate(new Date());
                var query = 
                `insert into logins (datetime, user_id) values` +
                `("${date}", ${user.user_id})`
                database.query(query);
                return done(null, user);
            } else {
                return done(null, false, {message: 'Password incorrect'});
            }
        } catch(e) {
            return done(e);
        }
    }

    passport.use(new LocalStrategy({usernameField: 'username'},
    authenticateUser));
    passport.serializeUser((user, done) => done(null, user.user_id));
    passport.deserializeUser((user_id, done) => {
        return done(null, getUserById(user_id));
    });
}

function formatDate(date) {
    var pad = function(num) { return ('00'+num).slice(-2) };
    date = date.getUTCFullYear()         + '-' +
        pad(date.getUTCMonth() + 1)  + '-' +
        pad(date.getUTCDate())       + ' ' +
        pad(date.getUTCHours())      + ':' +
        pad(date.getUTCMinutes())    + ':' +
        pad(date.getUTCSeconds());
    return date;
}

function returnDate(date) {
    var pad = function(num) { return ('00'+num).slice(-2) };
    date = date.getUTCFullYear()         + '-' +
        pad(date.getUTCMonth() + 2)  + '-' +
        pad(date.getUTCDate())       + ' ' +
        pad(date.getUTCHours())      + ':' +
        pad(date.getUTCMinutes())    + ':' +
        pad(date.getUTCSeconds());
    return date;
}

module.exports = {initialize, formatDate, returnDate};