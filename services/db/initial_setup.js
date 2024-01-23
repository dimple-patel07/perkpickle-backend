const dbService = require("./db_service");
// only applicable for initial table setup
async function setup(req, res) {
	let msg;
	try {
		res.statusCode = 500;
		const isCreated = await dbService.createUserTable();
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
			const isCreated = await dbService.createUser(data);
			if (isCreated) {
				// update with verified tag
				data.is_verified = true;
				data.otp = null;
				const isUpdated = await dbService.updateUser(data);
				if (isUpdated) {
					res.statusCode = 200;
					msg = "setup successfully completed";
				}
			}
		}
	} catch (error) {
		console.error("initial setup error :: ", error);
	} finally {
		if (!msg) {
			msg = "setup failed";
		}
		return msg;
	}
}
module.exports = { setup };
