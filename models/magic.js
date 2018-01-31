const db = require('../db/index.js');
const axios = require('axios');
const moment = require('moment');

const magicModel = {};
const today = moment().format('YYYY-MM-DD'); // get today's date

magicModel.getMagic = (req, res, next) => {
	db
		.oneOrNone('SELECT * FROM magic WHERE location_name = $1 AND last_updated = $2;', [req.body.placeName, today])
		.then(result => {
			console.log('*getMagic initial db call to check existing location info. result:', result);
			if (result) {
				// if we get back a result from db then no need to request axios call, just return data
				console.log('**lookie here! location data exists for today! lets grab that');
				result.dbExists = true;
				res.locals.magicData = result;
				next();
			} else {
				// if no result from db then make axios call to retrieve sunrise/sunset info
				console.log('**no location data for today. making axios call to get fresh data...');
				axios({
					url: 'https://api.sunrise-sunset.org/json',
					method: 'get',
					params: { lat: req.body.latitude, lng: req.body.longitude, formatted: 0 }
				})
					.then(response => {
						response.data.results.dbExists = false;
						console.log('**axios request success!! heres the data:', response.data);
						res.locals.magicData = response.data.results;

						// store fresh info in our database
						db.oneOrNone(
							'INSERT INTO magic (location_name, last_updated, sunrise, sunset) VALUES ($1, $2, $3, $4) RETURNING *;',
							[req.body.placeName, today, response.data.results.sunrise, response.data.results.sunset]
						);
						next();
					})
					.catch(error => {
						console.log('**uh oh. looks like axios call to get latest magic info failed. Error:', error);
						next(error);
					});
				// next();
			}
		})
		.catch(error => {
			console.log('*oops! pgp exception in magicModel.getMagic. Error:', error);
			next(error);
		});
};

// magicModel.getMagic = (req, res, next) => {
// 	db
// 		.task(t => {
// 			return t
// 				.oneOrNone('SELECT * FROM magic WHERE location_name = $1 AND last_updated = $2;', [req.body.placeName, today])
// 				.then(result => {
// 					console.log('result', result);
// 					if (result) {
// 						console.log('record exists in db!!!');
// 						result.dbExist = true;
// 						return result;
// 					} else {
// 						console.log('no result. making axios call.');
// 						// return []; // user not found, so no events
// 						axios({
// 							url: 'https://api.sunrise-sunset.org/json',
// 							method: 'get',
// 							params: { lat: req.body.latitude, lng: req.body.longitude, formatted: 0 }
// 						})
// 							.then(response => {
// 								console.log('req.body --->>', req.body);
// 								console.log('getMagic response: --> ', response.data);
// 								res.locals.magicData = response.data;

// 								db.oneOrNone(
// 									'INSERT INTO magic (location_name, last_updated, sunrise, sunset) VALUES ($1, $2, $3, $4) RETURNING *;',
// 									[req.body.placeName, today, response.data.results.sunrise, response.data.results.sunset]
// 								);
// 								next();
// 							})
// 							.catch(error => {
// 								console.log('Error encountered in magicModel.getMagic axios call. Error:', error);
// 								next(error);
// 							});
// 					}
// 				});
// 		})
// 		.then(data => {
// 			// success
// 			console.log('success!!!!!!! heres the db data:', data);
// 			res.locals.magicData = data;
// 			next();
// 		})
// 		.catch(error => {
// 			console.log('Error encountered in getMagic. Error:', error);
// 			next(error);
// 		});
// };

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
