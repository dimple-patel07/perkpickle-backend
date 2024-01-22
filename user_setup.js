const pg = require("pg");
setup();
async function setup() {
	// CREATE USER perkpickle WITH PASSWORD 'perkpickle123';
	// CREATE DATABASE perkpickle_db OWNER perkpickle;
	// $ psql -h localhost -d perkpickle_db -U perkpickle;
	const client = new pg.Client({
		host: "localhost",
		database: "perkpickle_db",
		user: "perkpickle",
		password: "perkpickle123",
	});

	client.connect(function (error) {
		if (error) {
			console.error("Connection error :: ", error);
			// throw err
		} else {
			console.log("Connected!");
			let sql = `CREATE TABLE IF NOT EXISTS users (
                email VARCHAR(255) primary key,
                name VARCHAR(255) not null,
                zip_code int not null,
                address VARCHAR(255),
                phone_number VARCHAR(255) not null,
                secret_key VARCHAR(255) not null,
                otp int
            )`;
			client.query(sql, function (error, result) {
				if (error) {
					console.error("Table creation error :: ", error);
				} else {
					console.log("Table created", result);
					// 'perkpickle@123' - 'cGVya3BpY2tsZUAxMjM'
					sql = "INSERT INTO users (email, name, zip_code, address, phone_number, secret_key) VALUES ('help@perkpickle.com', 'perkpickle', 73301, 'Austin Tx', '1{512)555-3890', 'cGVya3BpY2tsZUAxMjM')";

					client.query(sql, function (err, result) {
						if (error) {
							console.error("Table creation error :: ", error);
						} else {
							console.log("User created :: ", result);
						}

						// close the connection
						client.end((err) => {
							if (error) {
								console.error("connection closing error :: ", error);
							} else {
								console.log("connection closed");
							}
						});
					});
				}
			});
		}
	});
}
