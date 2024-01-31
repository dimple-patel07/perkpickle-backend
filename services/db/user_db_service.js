const commonUtils = require("../utils/common_utils");
const dbService = require("./db_service");

// create user table
async function createUserTable() {
	return new Promise(async (resolve) => {
		const sql = `CREATE TABLE IF NOT EXISTS users (
            id SERIAL,
            email VARCHAR(255) primary key,
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            zip_code INT,
            address VARCHAR(255),
            phone_number VARCHAR(255),
            secret_key VARCHAR(255),
            is_verified BOOLEAN DEFAULT false,
            is_signup_completed BOOLEAN DEFAULT false,
            otp INT,
            card_keys TEXT,
            created_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
            modified_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
        )`;
		const client = await dbService.connectDb();
		let isCreated = false;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("users table creation error :: ", error);
				} else {
					isCreated = true;
					console.log("users table created");
				}
				await dbService.disConnectDb();
				resolve(isCreated);
			});
		} else {
			resolve(isCreated);
		}
	});
}
// create new user
function createUser(data) {
	return new Promise(async (resolve) => {
		const sql = `INSERT INTO users (email, otp) VALUES (
            '${data.email}',
            ${data.otp}
        )`;
		const client = await dbService.connectDb();
		let isInserted = false;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("user creation error :: ", error);
				} else {
					isInserted = true;
					console.log("user created successfully");
				}
				await dbService.disConnectDb();
				resolve(isInserted);
			});
		} else {
			resolve(isInserted);
		}
	});
}
// update user
// required fields for update operations - email, first-name, last-name, zip-code, secret-key(password)
function updateUser(data) {
	return new Promise(async (resolve) => {
		const sql = `UPDATE users SET
            email = '${data.email}',
            first_name = ${data.first_name ? `'${data.first_name}'` : null},
            last_name = ${data.last_name ? `'${data.last_name}'` : null},
            zip_code = ${data.zip_code ? `'${data.zip_code}'` : null},
            address = ${data.address ? `'${data.address}'` : null},
            phone_number = ${data.phone_number ? `'${data.phone_number}'` : null},
            secret_key = ${data.secret_key ? `'${data.secret_key}'` : null},
            card_keys = ${data.card_keys ? `'${data.card_keys}'` : null},
            otp = ${data.otp ? data.otp : null},
            is_verified = ${data.is_verified ? data.is_verified : false},
            is_signup_completed = ${data.is_signup_completed ? data.is_signup_completed : false},
            modified_date = NOW()
            WHERE email = '${data.email}'
        `;
		const client = await dbService.connectDb();
		let isUpdated = false;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("user updation error :: ", error);
				} else {
					isUpdated = true;
					console.log("user updated successfully");
				}
				await dbService.disConnectDb();
				resolve(isUpdated);
			});
		} else {
			resolve(isUpdated);
		}
	});
}
// get user by email and otp
function getUserByEmailAndOtp(email, otp) {
	return new Promise(async (resolve) => {
		const sql = `SELECT * from users where email='${email}' and otp=${otp}`;
		const client = await dbService.connectDb();
		let found = null;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("user selection error :: ", error);
				} else if (result?.rows?.length > 0) {
					found = result.rows[0];
				}
				await dbService.disConnectDb();
				resolve(found);
			});
		} else {
			resolve(found);
		}
	});
}
// get user by email
function getUserByEmail(email) {
	return new Promise(async (resolve) => {
		const sql = `SELECT * from users where email='${email}'`;
		const client = await dbService.connectDb();
		let found = null;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("user selection error :: ", error);
				} else if (result?.rows?.length > 0) {
					found = result.rows[0];
				}
				await dbService.disConnectDb();
				resolve(found);
			});
		} else {
			resolve(found);
		}
	});
}
// get user by email and password
function getUserByEmailAndPassword(email, password) {
	return new Promise(async (resolve) => {
		const secretKey = commonUtils.encryptStr(password);
		const sql = `SELECT * from users where email='${email}' and secret_key='${secretKey}'`;
		const client = await dbService.connectDb();
		let found = null;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("user selection error :: ", error);
				} else if (result?.rows?.length > 0) {
					found = result.rows[0];
				}
				await dbService.disConnectDb();
				resolve(found);
			});
		} else {
			resolve(found);
		}
	});
}
// get all users
function getAllUsers() {
	return new Promise(async (resolve) => {
		const sql = `SELECT * from users`;
		const client = await dbService.connectDb();
		let found = null;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("all user selection error :: ", error);
				} else if (result?.rows?.length > 0) {
					found = result.rows;
				}
				await dbService.disConnectDb();
				resolve(found);
			});
		} else {
			resolve(found);
		}
	});
}
// delete user
function deleteUser(email) {
	return new Promise(async (resolve) => {
		const sql = `DELETE from users where email = '${email}'`;
		const client = await dbService.connectDb();
		let isDeleted = false;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("user deletion error :: ", error);
				} else if (result?.rowCount) {
					isDeleted = true;
				}
				await dbService.disConnectDb();
				resolve(isDeleted);
			});
		} else {
			resolve(isDeleted);
		}
	});
}
module.exports = { createUser, updateUser, getUserByEmailAndOtp, getUserByEmail, createUserTable, getUserByEmailAndPassword, getAllUsers, deleteUser };
