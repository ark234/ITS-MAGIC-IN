// Import dependencies
const bcrypt = require('bcryptjs');
const db = require('../db/index.js');

const userModel = {};

userModel.create = function create(user) {
	// This is where we obtain the hash of the user's password
	const passwordDigest = bcrypt.hashSync(user.password, 10);
	return db.oneOrNone('INSERT INTO users (email, password_digest) VALUES ($1, $2) RETURNING *;', [
		user.email,
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
