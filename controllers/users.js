// Import dependencies
const User = require('../models/user.js');
const router = require('express').Router();
const passport = require('passport');

// Import auth
const auth = require('../services/auth.js');

router.get('/', (req, res) => {
	res.redirect('/users/home');
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
			failureRedirect: '/users/register',
			successRedirect: '/users/home'
		}
	)
);

// Register new user
router.get('/register', (req, res) => {
	res.render('./register');
});

// Logout
router.get('/logout', (req, res) => {
	// Passport adds this method on req for us
	req.logout();
	// Redirect back to index page
	res.redirect('/users/login');
});

// Login
router.get('/login', (req, res) => {
	res.render('./login');
});

/**
 * Passport.authenticate will _build_ middleware for us
 * based on the 'local-login' strategy we registered with
 * passport in auth.js
 */
router.post(
	'/login',
	passport.authenticate('local-login', {
		failureRedirect: '/users/login',
		successRedirect: '/users/home'
	})
);

// Route to home page
router.get(
	'/home',
	// Middleware that redirects unauthenticated users to login
	auth.restrict,
	User.findByUsernamelMiddleware,
	(req, res) => {
		console.log('in handler for /home');
		console.log('req.user:');
		console.log(req.user);
		res.render('./home', { user: res.locals.userData });
	}
);

// Route to account page
router.get(
	'/account',
	// Middleware that redirects unauthenticated users to login
	auth.restrict,
	User.findByUsernamelMiddleware,
	(req, res) => {
		console.log('in handler for /account');
		console.log('req.user:');
		console.log(req.user);
		res.render('./account', { user: res.locals.userData });
	}
);

// Update account information
router.put('/account/:userId', auth.restrict, User.updateAccount, (req, res, next) => {
	res.send({ updatedAccountId: res.locals.updatedAccountId });
});

// Delete account
router.delete('/account/:userId', auth.restrict, User.deleteAccount, (req, res, next) => {
	res.json({});
});

// Update current user location
router.put('/:userId', auth.restrict, User.updateLocation, (req, res, next) => {
	console.log('route hit.');
	res.json(res.locals.updatedUserData);
});

module.exports = router;
