const pg = require("pg");
const client = getClient();
function getClient() {
	// expecting db with following credentials
	// CREATE USER perkpickle WITH PASSWORD 'perkpickle123';
	// CREATE DATABASE perkpickle_db OWNER perkpickle;
	// $ psql -h localhost -d perkpickle_db -U perkpickle;
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
		client.connect(function (error) {
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

function createNewUser(data) {
	return new Promise((resolve) => {
		const sql = `INSERT INTO users (email, name, zip_code, address, phone_number, secret_key, otp, is_verified) VALUES (
            '${data.email}',
            '${data.name}',
            ${data.zip_code},
            ${data.address ? `'${data.address}'` : null},
            '${data.phone_number}',
            '${data.secret_key}',
            ${data.otp ? data.otp : null},
            ${data.is_verified}
        )`;
		client.query(sql, function (error, result) {
			let isCreated = false;
			if (error) {
				console.error("Insertion error :: ", error);
			} else {
				isCreated = true;
				console.log("New user created");
			}
			resolve(isCreated);
		});
	});
}

function updateUser(data) {
	return new Promise((resolve) => {
		const sql = `UPDATE users SET
            email = '${data.email}',
            name = '${data.name}',
            zip_code = ${data.zip_code},
            address = ${data.address ? `'${data.address}'` : null},
            phone_number = '${data.phone_number}',
            secret_key = '${data.secret_key}',
            otp = ${data.otp ? data.otp : null},
            is_verified = ${data.is_verified} WHERE email = '${data.email}'`;
		client.query(sql, function (error, result) {
			let isUpdated = false;
			if (error) {
				console.error("Updation error :: ", error);
			} else {
				isUpdated = true;
				console.log("User updated");
			}
			resolve(isUpdated);
		});
	});
}

module.exports = { connectDb, disConnectDb, createNewUser, updateUser };
