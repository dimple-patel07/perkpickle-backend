const dbService = require("./db_service");
let client;
async function setup() {
	client = await dbService.connectDb();
	if (client) {
		const isCreated = await createUserTable();
		if (isCreated) {
			const data = {
				email: "help@perkpickle.com",
				name: "perkpickle",
				zip_code: 73301,
				address: "Austin Tx",
				phone_number: "1(512)555-3890",
				secret_key: "cGVya3BpY2tsZUAxMjM", // 'perkpickle@123' - 'cGVya3BpY2tsZUAxMjM'
				is_verified: false,
				otp: Math.floor(Math.random() * 10),
			};
			const isCreated = await dbService.createNewUser(data);
			if (isCreated) {
				// update with verified tag
				data.is_verified = true;
				data.otp = null;
				await dbService.updateUser(data);
			}
		}
	}
	await dbService.disConnectDb();
}
async function createUserTable() {
	return new Promise((resolve) => {
		const sql = `CREATE TABLE IF NOT EXISTS users (
            id SERIAL,
            email VARCHAR(255) primary key,
            name VARCHAR(255) not null,
            zip_code INT not null,
            address VARCHAR(255),
            phone_number VARCHAR(255) not null,
            secret_key VARCHAR(255) not null,
            is_verified BOOLEAN DEFAULT false,
            otp INT
        )`;
		client.query(sql, function (error, result) {
			let isCreated = false;
			if (error) {
				console.error("Table creation error :: ", error);
			} else {
				isCreated = true;
				console.log("Table created");
			}
			resolve(isCreated);
		});
	});
}
module.exports = { setup };
