// Import dependencies
const Magic = require('../models/magic.js');
const router = require('express').Router();

router.post('/', Magic.getMagic, (req, res, next) => {
	console.log('magic route hit');
	res.json(res.locals.magicData);
});

router.post('/insert', Magic.addMagic, (req, res, next) => {
	console.log('inserted new magic record');
	res.json({});
});

module.exports = router;
