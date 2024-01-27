const dbService = require("./db_service");
const commonUtils = require("../utils/common_utils");
// only applicable for initial table setup
async function setup(req, res) {
	let msg;
	try {
		console.log('setup started-----')
		res.statusCode = 500;
		const isCreated = await dbService.createUserTable();
		if (isCreated) {
			const data = {
				email: "help@perkpickle.com",
				otp: commonUtils.generateRandomNumber(),
			};
			const isCreated = await dbService.createUser(data);
			if (isCreated) {
				// expecting valid otp
				const userData = await dbService.getUserByEmailAndOtp(data.email, data.otp);
				if (userData && userData.email) {
					userData.is_verified = true;
					userData.otp = null;
					userData.first_name = "perk";
					userData.last_name = "pickle";
					userData.zip_code = 73301;
					userData.address = "Austin Tx";
					userData.phone_number = "1(512)555-3890";
					userData.secret_key = commonUtils.encryptStr("perkpickle@123"); // 'perkpickle@123' - 'cGVya3BpY2tsZUAxMjM'
				}
				const isUpdated = await dbService.updateUser(userData);
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
