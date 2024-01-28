const pg = require("pg");
var client;
function getClient() {
	// expecting db with following credentials (applicable for local system)
	// CREATE USER perkpickle WITH PASSWORD 'perkpickle123';
	// CREATE DATABASE perkpickle_db OWNER perkpickle;
	// psql -h localhost -d perkpickle_db -U perkpickle;
	console.log("----databaseurl---", process.env.DATABASE_URL);
	return new pg.Client({
		connectionString: process.env.DATABASE_URL,
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
