// Import dependencies
const User = require('../models/user.js');
const router = require('express').Router();
const passport = require('passport');

// Import auth
const auth = require('../services/auth.js');

router.get('/', (req, res, next) => {
	res.redirect('/home');
});

/**
 * We want the behavior of the site to vary depending on whether or
 * not the user is already logged in. If they are logged in, we want
 * to send them to /home. If they are not, we want to send them to
 * /register.
 */
router.post(
	'/',
	passport.authenticate(
		// The following string indicates the particular strategy instance
		// we'll want to use to handle signup. We defined behavior for
		// 'local-signup' back in index.js.
		'local-signup',
		{
			failureRedirect: '/register',
			successRedirect: '/home'
		}
	)
);

// Register new user
router.get('/new', (req, res) => {
	res.render('');
});

// Logout
router.get('/logout', (req, res) => {
	// Passport adds this method on req for us
	req.logout();
	// Redirect back to index page
	res.redirect('/');
});

// Login
router.get('/login', (req, res) => {
	res.render('/login');
});

/**
 * Passport.authenticate will _build_ middleware for us
 * based on the 'local-login' strategy we registered with
 * passport in auth.js
 */
router.post(
	'/login',
	passport.authenticate('local-login', {
		failureRedirect: '/login',
		successRedirect: '/home'
	})
);

// User profile
router.get(
	'/home',
	// Middleware that redirects unauthenticated users to login
	auth.restrict,
	User.findByEmailMiddleware,
	(req, res) => {
		console.log('in handler for /home');
		console.log('req.user:');
		console.log(req.user);
		res.render('/home', { user: res.locals.userData });
	}
);
