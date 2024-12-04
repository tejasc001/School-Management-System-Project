const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('register')
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Home Page!');
            res.redirect('/index');
        })
    } catch (e) {
        req.flash('error', e.message);
        console.log(e.message);
        res.redirect('/register');
    }
};


module.exports.renderLogin = (req, res) => {
    res.render('login.ejs');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/index';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
};