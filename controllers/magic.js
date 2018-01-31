// Import dependencies
const Magic = require('../models/magic.js');
const router = require('express').Router();

// Import auth
const auth = require('../services/auth.js');

router.post(
	'/',
	auth.restrict, // Middleware that redirects unauthenticated users to login
	Magic.getMagic,
	(req, res, next) => {
		console.log('magic route hit');
		res.json(res.locals.magicData);
	}
);

module.exports = router;
