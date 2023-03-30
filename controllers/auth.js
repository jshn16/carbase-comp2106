const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/register', (req, res) => {
    let messages = req.session.messages?.message;
    // clear session error msg
    req.session.messages = [];

    res.render('auth/register', {
        title: 'Register',
        messages: messages
    });
});

router.post('/register', (req, res) => {
    // use User model to try creating a new user
    // User model extends passport-local-mongoose, so it does duplicate checks and hashes passwords
    User.register(new User({
        username: req.body.username
    }), req.body.password,
        (err, user) => {
            if (err) {
                // store error in session var so we can display it after redirecting
                console.log(err);
                req.session.messages = err;
                res.redirect('/auth/register');
            }
            else {
                res.redirect('/cars');
            }
        });
});

router.get('/login', (req, res) => {
    let messages = req.session.messages;
    req.session.messages = [];

    res.render('auth/login', {
        title: 'Login',
        messages: messages
    });
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/cars',
    failureRedirect: '/auth/login',
    failureMessage: 'Invalid Login'
}));


router.get('/logout', (req, res) => {
    req.logout((error) => {

        if (error) {
            console.log(error)
        }
        res.redirect('/')
    })
})

//google sign in

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}), (req, res) => { })


router.get('/google/callback', passport.authenticate('google', {
    successRedirect: "/cars",
    failureRedirect: "/auth/login",
    failureMessage: "Authentiaction With Google Failed!"
}))


//facebook Auth
router.get('/facebook', passport.authenticate('facebook',
    {
        scope: ['email']
    }), (req, res) => { })


router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: "/cars",
    failureRedirect: "auth/login",
    failureMessage: "Login With FaceBook Failed"
}))

module.exports = router;