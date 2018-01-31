const db = require('../db/index.js');
const axios = require('axios');
const moment = require('moment');

const magicModel = {};
const today = moment().format('YYYY-MM-DD'); // get today's date

magicModel.addMagic = (req, res, next) => {
	db.oneOrNone(
		'INSERT INTO magic (location_name, last_updated, sunrise, sunset) VALUES ($1, $2, $3, $4) RETURNING *;',
		[req.body.location, today, req.body.sunrise, req.body.sunset]
	);
};

magicModel.getMagic = (req, res, next) => {
	db
		.task(t => {
			return t
				.oneOrNone('SELECT * FROM magic WHERE location_name = $1 AND last_updated = $2;', [req.body.placeName, today])
				.then(result => {
					console.log('result', result);
					if (result) {
						console.log('record exists in db!!!');
						result.dbExist = true;
						return result;
					} else {
						console.log('no result. making axios call.');
						// return []; // user not found, so no events
						axios({
							url: 'https://api.sunrise-sunset.org/json',
							method: 'get',
							params: { lat: req.body.latitude, lng: req.body.longitude, formatted: 0 }
						})
							.then(response => {
								console.log('req.body --->>', req.body);
								console.log('getMagic response: --> ', response.data);
								res.locals.magicData = response.data;

								db.oneOrNone(
									'INSERT INTO magic (location_name, last_updated, sunrise, sunset) VALUES ($1, $2, $3, $4) RETURNING *;',
									[req.body.placeName, today, response.data.results.sunrise, response.data.results.sunset]
								);
								next();
							})
							.catch(error => {
								console.log('Error encountered in magicModel.getMagic axios call. Error:', error);
								next(error);
							});
					}
				});
		})
		.then(data => {
			// success
			console.log('success!!!!!!! heres the db data:', data);
			res.locals.magicData = data;
			next();
		})
		.catch(error => {
			console.log('Error encountered in getMagic. Error:', error);
			next(error);
		});
};

// magicModel.getMagic = (req, res, next) => {
// 	console.log('in magicModel.getMagic. req.body: -->', req.body);
// 	axios({
// 		url: 'https://api.sunrise-sunset.org/json',
// 		method: 'get',
// 		params: { lat: req.body.latitude, lng: req.body.longitude, formatted: 0 }
// 	})
// 		.then(response => {
// 			console.log('getMagic response: --> ', response.data);
// 			res.locals.magicData = response.data;
// 			next();
// 		})
// 		.catch(error => {
// 			console.log('Error encountered in magicModel.getMagic axios call. Error:', error);
// 			next(error);
// 		});
// };

module.exports = magicModel;
