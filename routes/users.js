const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

// Login page
router.get('/login', (req, res) => res.render('login'));

// Register page
router.get('/register', (req, res) => res.render('register'));

// get learners list
router.get('/learners', async (req, res) => {
	try {
		const users = await User.find({ admin: false });
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Register handler
router.post('/register', (req, res) => {
	const { name, email, password, password2 } = req.body;
	const errors = [];

	// check required fields
	if (!name || !email || !password || !password2) {
		errors.push({ msg: 'Please fill in all fields.' });
	}

	// check password match
	if (password !== password2) {
		errors.push({ msg: 'Please ensure masswords match.' });
	}

	// check password length
	if (password.length < 6) {
		errors.push({ msg: 'Password must be at least 6 characters long.' });
	}

	if (errors.length > 0) {
		res.render('register', {
			errors,
			name,
			email,
			password,
			password2,
		});
	} else {
		// Validation passed
		User.findOne({ email })
			.then(user => {
				if (user) {
					// user already exists
					errors.push({ msg: 'Email is already registered.' });
					res.render('register', {
						errors,
						name,
						email,
						password,
						password2,
					});
				} else {
					const newUser = new User({
						name,
						email,
						password,
						// initialise user with 'n/a' scores for personality
						personality: {
							extraversion: 'n/a',
							agreeableness: 'n/a',
							conscientiousness: 'n/a',
							emotionalStability: 'n/a',
							opennessToExperience: 'n/a',
						},
					});
					// encrypt password
					bcrypt.genSalt(10, (err, salt) =>
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;
							// Set password to encrypted
							newUser.password = hash;
							// Save user
							newUser
								.save()
								.then(user => {
									req.flash(
										'success_msg',
										'You are now registered and can log in.'
									);
									res.redirect('/users/login');
								})
								.catch(err => console.log(err));
						})
					);
				}
			})
			.catch(err => console.log(err));
	}
});

// Login Handler
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/home',
		failureRedirect: '/users/login',
		failureFlash: true,
	})(req, res, next);
});

// Logout handler
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You were logged out successfully.');
	res.redirect('/users/login');
});

module.exports = router;
