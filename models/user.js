// Import dependencies
const bcrypt = require('bcryptjs');
const db = require('../db/index.js');

const userModel = {};

/**
 * Create new user in users table.
 * @param {*} user user to create
 */
userModel.create = function create(user) {
	// This is where we obtain the hash of the user's password
	console.log('creating user:', user);
	const passwordDigest = bcrypt.hashSync(user.password, 10);
	return db.oneOrNone(
		'INSERT INTO users (username, email, phone, zip, password_digest) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
		[user.username, user.email, user.phone, user.zip, passwordDigest]
	);
};

userModel.findByEmail = function findByEmail(email) {
	return db.oneOrNone('SELECT * FROM users WHERE email = $1;', [email]);
};

userModel.findByUsername = function findByUsername(username) {
	return db.oneOrNone('SELECT * FROM users WHERE username = $1;', [username]);
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

// Non-middleware version for use in services/auth.js
userModel.findByUsernamelMiddleware = function findByUsernameMiddleware(req, res, next) {
	console.log('in findByUsernameMiddleware');
	const username = req.user.username;
	userModel
		.findByUsername(username)
		.then(userData => {
			res.locals.userData = userData;
			next();
		})
		.catch(err => {
			console.log('Error:', err);
		});
};

// Middleware for updating user account
userModel.updateAccount = (req, res, next) => {
	console.log('in updateAccount');
	db
		.one('UPDATE users SET email = $1, phone = $2, zip = $3 WHERE id = $4 RETURNING id;', [
			req.body.user.email,
			req.body.user.phone,
			req.body.user.zip,
			req.params.userId
		])
		.then(data => {
			res.locals.updatedUserId = data.id;
			next();
		})
		.catch(error => {
			console.log('Error encountered in userModel.updateAccount. Error:', error);
			next(error);
		});
};

// Middleware for deleting user account
userModel.deleteAccount = (req, res, next) => {
	console.log('in deleteAccount');
	db
		.none('DELETE FROM users WHERE id = $1;', [req.params.userId])
		.then(() => {
			next();
		})
		.catch(error => {
			console.log('Error encountered in userModel.deleteAccount. Error:', error);
			next(error);
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
