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

//
