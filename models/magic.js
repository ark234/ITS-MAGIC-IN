const db = require('../db/index.js');
const axios = require('axios');
const moment = require('moment');

const magicModel = {};

magicModel.getMagic = (req, res, next) => {
	console.log('in magicModel.getMagic. req.body: -->', req.body);
	axios({
		url: 'https://api.sunrise-sunset.org/json',
		method: 'get',
		params: { lat: req.body.latitude, lng: req.body.longitude }
	})
		.then(response => {
			console.log('getMagic response: --> ', response.data);
			res.locals.magicData = response.data;
			next();
		})
		.catch(error => {
			console.log('Error encountered in magicModel.getMagic axios call. Error:', error);
			next(error);
		});
};

module.exports = magicModel;
