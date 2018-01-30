// Import dependencies
const bcrypt = require('bcryptjs');
const db = require('../db/index.js');

const userModel = {};

userModel.create = function create(user) {
	// This is where we obtain the hash of the user's password
	console.log('creating user:', user);
	const passwordDigest = bcrypt.hashSync(user.password, 10);
	return db.oneOrNone('INSERT INTO users (email, phone, zip, password_digest) VALUES ($1, $2, $3, $4) RETURNING *;', [
		user.email,
		user.phone,
		user.zip,
		passwordDigest
	]);
};

userModel.findByEmail = function findByEmail(email) {
	return db.oneOrNone('SELECT * FROM users WHERE email = $1;', [email]);
};

// Non-middleware version for use in services/auth.js
userModel.findByEmailMiddleware = function findByEmailMiddleware(req, res, next) {
	console.log('in findByEmailMiddleware');
	const email = req.user.email;
	userModel
		.findByEmail(email)
		.then(userData => {
			res.locals.userData = userData;
			next();
		})
		.catch(err => {
			console.log('Error:', err);
		});
};

// Middleware for updating user location
userModel.updateLocation = (req, res, next) => {
	console.log('in updateLocation');
	db
		.one('UPDATE users SET current_location = $1 WHERE id = $2 RETURNING *;', [
			req.body.locationData.name,
			req.params.userId
		])
		.then(data => {
			res.locals.updatedUserData = data;
			next();
		})
		.catch(error => {
			console.log('Error encountered in userModel.updateLocation. Error:', error);
			next(error);
		});
};

module.exports = userModel;
