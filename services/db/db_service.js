const pg = require("pg");
var client;

// const pool = new pg.Pool({
// 	connectionString: process.env.DATABASE_URL,
// 	max: 20,
// 	idleTimeoutMillis: 30000,
// 	connectionTimeoutMillis: 2000,
// 	ssl: {
// 		rejectUnauthorized: false, // required to handle SSL error
// 	},
// });
// const client = await pool.connect()
// await client.query(sql)
// client.release()

function getClient() {
	// expecting db with following credentials (applicable for local system)
	// CREATE USER perkpickle WITH PASSWORD 'perkpickle123';
	// CREATE DATABASE perkpickle_db OWNER perkpickle;
	// psql -h localhost -d perkpickle_db -U perkpickle;
	// ----------------

	return new pg.Client({
		connectionString: process.env.DATABASE_URL, // required on heroku
		// either connectionString or below credentials
		// host: process.env.DB_HOST,
		// database: process.env.DB_NAME,
		// user: process.env.DB_OWNER,
		// password: process.env.DB_PASSWORD,
		// port: process.env.DB_PORT || 5432,
		ssl: {
			rejectUnauthorized: false, // required to handle SSL error
		},
	});

	// -------------------
}
// connect db
function connectDb() {
	return new Promise((resolve) => {
		client = getClient();
		client.connect((error) => {
			let result = null;
			if (error) {
				console.error("Connection error :: ", error);
			} else {
				result = client;
				console.log("Connected!");
			}
			resolve(result);
		});
	});
}
// disconnect db
function disConnectDb() {
	return new Promise((resolve) => {
		client.end((error) => {
			let result = null;
			if (error) {
				console.error("Closing connection error :: ", error);
			} else {
				result = client;
				console.log("Disconnected!");
			}
			resolve(result);
		});
	});
}

module.exports = { connectDb, disConnectDb };
