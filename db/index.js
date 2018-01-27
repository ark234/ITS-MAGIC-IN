// Import dependencies
const pgp = require('pg-promise')();

// Configuration object
const cn = {
	host: 'localhost',
	port: 5432,
	databse: 'fuzzy_yellow',
	user: 'ark234'
};

const db = pgp(cn);

module.exports = db;
