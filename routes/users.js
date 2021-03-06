const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// Register
router.get('/register', function (req, res) {
	res.render('pages/register');
});

// login
router.get('/login', function(req, res){
	res.render('pages/login');
});


// Register User
router.post('/register', function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const confirmpassword = req.body.confirmpassword;
	const permission = req.body.permission;
	

	// Validation
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('confirmpassword', 'Passwords do not match').equals(req.body.password);
	req.checkBody('permission', 'Invalid user permission').isIn(User.schema.path('permission').enumValues)
	
	const errors = req.validationErrors();

	if (errors) {
		res.render('pages/register', {
			errors: errors
		});
	}
	else {
		User.findOne({ "username": username }, function (err, user) {
			if (user) {
				res.render('pages/register', {
					user: user,
				});
			}
			else {
				const newUser = new User({
					username: username,
					password: password,
					permission: permission
				});
				User.createUser(newUser, function (err, user) {
					if (err) throw err;
					console.log(user);
				});
				req.flash('success_msg', 'You are registered and can now login');
				res.redirect('/users/login');
			}
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login', passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/dashboard');
});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/');
});


module.exports = router;
