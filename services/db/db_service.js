const pg = require("pg");
function getClient() {
	const client = new pg.Client({
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		user: process.env.DB_OWNER,
		password: process.env.DB_PASSWORD,
	});
	return client;
}
function connectDb() {
	return new Promise((resolve) => {
		const client = getClient();
		client.connect(function (error) {
			let result = false;
			if (error) {
				console.error("Connection error :: ", error);
			} else {
				result = true;
				console.log("Connected!");
			}
			resolve(result);
		});
	});
}
function disConnectDb() {
	return new Promise((resolve) => {
		const client = getClient();
		client.end(function (error) {
			let result = false;
			if (error) {
				console.error("Closing connection error :: ", error);
			} else {
				result = true;
				console.log("Disconnected!");
			}
			resolve(result);
		});
	});
}

async function createTable() {}

async function insertRecord() {}
// async function initialSetup() {
// 	const isConnected = await connectDb();
// 	if (isConnected) {
// 	}
// }

module.exports = { connectDb, disConnectDb };
