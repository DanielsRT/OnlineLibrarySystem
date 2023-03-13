const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = getUserByUsername(username);
        if (user == null) {
            return done(null, false, {message: 'No user with that username'});
        }
        var hashedPassword = user.password;//JSON.stringify(user.password);
        console.log('DB password: ' + hashedPassword)
        try {
            if (await bcrypt.compare(password, hashedPassword)) {
            //if (password === user.password) {
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

module.exports = initialize;