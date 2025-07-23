const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');

// @desc    Show register page
// @route   GET /auth/register
router.get('/register', (req, res) => res.render('register'));

// @desc    Handle register
// @route   POST /auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Validation checks
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', { errors, name, email, password, password2 });
    } else {
        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', { errors, name, email, password, password2 });
            } else {
                const newUser = new User({ name, email, password });
                const salt = await bcrypt.genSalt(10);
                newUser.password = await bcrypt.hash(password, salt);
                await newUser.save();
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/');
            }
        } catch (err) {
            console.error(err);
            errors.push({ msg: 'Something went wrong' });
            res.render('register', { errors, name, email, password, password2 });
        }
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        req.flash('success_msg', 'You are logged out');
        res.redirect('/');
    });
});

module.exports = router; 