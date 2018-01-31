const db = require('../db/index.js');
const axios = require('axios');
const moment = require('moment');

const magicModel = {};
const today = moment().format('YYYY-MM-DD'); // get today's date

/**
 * This is where the magic happens. We are getting place name and coordinates
 * from the client and checking if the sunset/sunrise information has previously
 * been cached for today at that locaiton, and respond with it if it has, otherwise
 * request today's sunset/sunrise info via axios, and either update a currently
 * existing location or insert a new location.
 */
magicModel.getMagic = (req, res, next) => {
	db
		.oneOrNone('SELECT * FROM magic WHERE location_name = $1 AND last_updated = $2;', [req.body.placename, today])
		.then(result => {
			console.log('*getMagic initial db call to check existing location info. result:', result);
			if (result) {
				// if we get back a result from db then no need to request axios call, just return data
				console.log('**lookie here! location data exists for today! lets grab that');
				res.locals.magicData = result;
				next();
			} else {
				// if no result from db then make axios call to retrieve sunrise/sunset info
				console.log('**no location data for today. making axios call to get fresh data...');
				axios({
					url: 'https://api.sunrise-sunset.org/json',
					method: 'get',
					params: { lat: req.body.lat, lng: req.body.lng, formatted: 0 }
				})
					.then(response => {
						console.log('**axios request success!! heres the data:', response.data);
						res.locals.magicData = response.data.results;

						// store fresh info in our database - update if exists, otherwise insert
						// https://www.postgresql.org/docs/9.5/static/sql-insert.html#SQL-ON-CONFLICT
						db
							.oneOrNone(
								'INSERT INTO magic (location_name, last_updated, sunrise, sunset) VALUES ($1, $2, $3, $4) ON CONFLICT (location_name) DO UPDATE SET last_updated = $2, sunrise = $3, sunset = $4;',
								[req.body.placename, today, response.data.results.sunrise, response.data.results.sunset]
							)
							.catch(error => {
								console.log('Error encountered in insert/update query inside getMagic. Error:', error);
							});
						next();
					})
					.catch(error => {
						console.log('**uh oh. looks like axios call to get latest magic info failed. Error:', error);
						next(error);
					});
			}
		})
		.catch(error => {
			console.log('*oops! pgp exception in magicModel.getMagic. Error:', error);
			next(error);
		});
};

module.exports = magicModel;
