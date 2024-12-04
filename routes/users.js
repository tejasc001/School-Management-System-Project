const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controller/users.js');

router.get('/register', user.renderRegister);

router.post('/register',user.register);

//req.login takes the user to campgrounds after registering directly instead of the user need to press login icon again

router.get('/login', user.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login);

router.get('/logout', user.logout);


module.exports = router;