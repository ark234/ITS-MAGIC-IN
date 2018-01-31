// Import dependencies
const pgp = require('pg-promise')();

// Configuration object
const cn = {
	host: 'localhost',
	port: 5432,
	database: 'fuzzy_yellow'
};

const db = pgp(process.env.DATABSE_URL || cn);

module.exports = db;
