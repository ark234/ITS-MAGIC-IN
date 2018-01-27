// Import dependencies
const pgp = require('pg-promise')();

// Configuration object
const cn = {
	host: 'localhost',
	port: 5432,
	databse: 'fuzzy_yellow'
};

const db = pgp(cn);

module.exports = db;
