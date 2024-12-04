// navbarMiddleware.js

module.exports = function(req, res, next) {
    res.locals.navbarLinks = [
        { text: 'Home', link: '/home' },
        { text: 'New Student', link: '/new-student' },
        { text: 'Register', link: '/register' },
        { text: 'Login', link: '/login' },
        { text: 'Logout', link: '/logout' }
    ];
    next();
};
