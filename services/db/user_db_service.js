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
            zip_code VARCHAR(255),
            address VARCHAR(255),
            phone_number VARCHAR(255),
            secret_key VARCHAR(255),
            is_verified BOOLEAN DEFAULT false,
            is_signup_completed BOOLEAN DEFAULT false,
            is_admin BOOLEAN DEFAULT false,
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
            is_admin = ${data.is_admin ? data.is_admin : false},
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
// create new user for admin
function createUserAdmin(data) {
	data.secret_key = commonUtils.encryptStr(data.password);
	return new Promise(async (resolve) => {
		const sql = `INSERT INTO users (email, first_name, last_name,zip_code,address, phone_number, secret_key,is_verified, is_signup_completed, is_admin) VALUES (
            '${data.email}',
            '${data.first_name}','${data.last_name}','${data.zip_code}','${data.address}','${data.phone_number}','${data.secret_key}',
			${data.is_verified},${data.is_signup_completed},${data.is_admin ? data.is_admin : false}
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
function findAllUsers(req) {
	return new Promise(async (resolve) => {
		let page = parseInt(req.body.pageNumber);
		let limit = parseInt(req.body.pageSize);
		let sortby = req.body.sortBy;
		let sortorder = req.body.sortOrder;
		let search = req.body.search;
		const offset = page ? (page - 1) * limit : 0;

		const sql = `SELECT count(*) as total from users where is_signup_completed = true and (first_name like '%${search}%' OR last_name like '%${search}%' OR email like '%${search}%')`;
		console.log(sql);
		const client = await dbService.connectDb();

		let cardList = [];
		let count = 0;
		let dataRes = {
			totalCount: 0,
			pageNumber: page,
			pageSize: limit,
			sortBy: sortby,
			sortOrder: sortorder,
			search: search,
			data: [],
		};
		if (client) {
			client.query(sql, async (error, result) => {
				count = result.rows[0].total;
				console.log(count);
				if (error) {
					console.error("users selection error :: ", error);
				} else {
					const sql2 = `SELECT * from users where is_signup_completed = true and (first_name like '%${search}%' OR last_name like '%${search}%' OR email like '%${search}%') ORDER BY ${sortby} ${sortorder} limit ${limit} offset ${offset}`;
					console.log(sql2);

					client.query(sql2, async (error, resultData) => {
						if (error) {
							console.error("users selection error :: ", error);
						}
						if (resultData?.rows?.length > 0) {
							cardList = resultData.rows;
							dataRes = {
								totalCount: parseInt(count),
								pageNumber: page,
								pageSize: limit,
								sortBy: sortby,
								sortOrder: sortorder,
								search: search,
								data: resultData.rows,
							};
						}
						await dbService.disConnectDb();
						resolve(dataRes);
					});
				}
			});
		} else {
			resolve(dataRes);
		}
	});
}
function verifyAdminUser(email, password) {
	return new Promise(async (resolve) => {
		const secretKey = commonUtils.encryptStr(password);
		const sql = `SELECT * from users where is_admin = true and email='${email}' and secret_key='${secretKey}'`;
		console.log(sql);
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
module.exports = { createUser, updateUser, getUserByEmailAndOtp, getUserByEmail, createUserTable, getUserByEmailAndPassword, getAllUsers, deleteUser, createUserAdmin, findAllUsers, verifyAdminUser };
