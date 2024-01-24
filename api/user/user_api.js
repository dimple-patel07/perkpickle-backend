const dbService = require("../../services/db/db_service");
const commonUtils = require("../../services/utils/common_utils");

// create user
async function createUser(req, res) {
	let result = null;
	try {
		res.statusCode = 500;
		const params = req.body;
		if (params && params.email) {
			// required parameter - email
			const data = await dbService.getUserByEmail(params.email);
			if (data && data.email) {
				result = { error: "email already exist" };
			} else {
				params.otp = commonUtils.generateRandomNumber();
				const isCreated = await dbService.createUser(params);
				if (isCreated) {
					res.statusCode = 201;
					delete params.secret_key;
					result = { email: params.email, otp: params.otp };
				}
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("create user api failed :: ", error);
	} finally {
		return result;
	}
}
// verify user
async function verifyUser(req, res) {
	let result = null;
	try {
		const params = req.body;
		res.statusCode = 500;
		if (params && params.email && params.otp) {
			// required parameters - email, otp
			const data = await dbService.getUserByEmailAndOtp(params.email, params.otp);
			if (data) {
				data.is_verified = true;
				data.otp = null;
				const isUpdated = await dbService.updateUser(data);
				if (isUpdated) {
					res.statusCode = 200;
					result = { email: params.email };
				}
			} else {
				res.statusCode = 404;
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("verify user api failed :: ", error);
	} finally {
		return result;
	}
}

// update user
async function updateUser(req, res) {
	let result = null;
	try {
		const params = req.body;
		res.statusCode = 500;
		if (params && params.email) {
			// required parameters - email, otp
			const data = await dbService.getUserByEmail(params.email);
			if (data) {
				if (params.password) {
					params.secret_key = commonUtils.encryptStr(params.password);
				}
				params.is_verified = data.is_verified;
				const isUpdated = await dbService.updateUser(params);
				if (isUpdated) {
					res.statusCode = 200;
					result = { email: params.email };
				}
			} else {
				res.statusCode = 404;
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("update user api failed :: ", error);
	} finally {
		return result;
	}
}

// get user by email & password (secret_key)
async function getUserByEmailAndPassword(req, res) {
	let result = null;
	try {
		const params = req.body;
		res.statusCode = 500;
		if (params && params.email && params.password) {
			// required parameters - email, password
			const data = await dbService.getUserByEmailAndPassword(params.email, params.password);
			if (data) {
				res.statusCode = 200;
				delete data.secret_key;
				result = data;
			} else {
				res.statusCode = 404;
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("get user by email and password api failed :: ", error);
	} finally {
		return result;
	}
}

// get user by email
async function getUserByEmail(req, res) {
	let result = null;
	try {
		const params = req.body;
		res.statusCode = 500;
		if (params && params.email) {
			// required parameter - email
			const data = await dbService.getUserByEmail(params.email);
			if (data) {
				res.statusCode = 200;
				delete data.secret_key;
				result = data;
			} else {
				res.statusCode = 404;
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("get user by email api failed :: ", error);
	} finally {
		return result;
	}
}
// resend opt
async function resendOtp(req, res) {
	let result = null;
	try {
		const params = req.body;
		res.statusCode = 500;
		if (params && params.email) {
			// required parameter - email
			const data = await dbService.getUserByEmail(params.email);
			if (data) {
				data.is_verified = false;
				data.otp = commonUtils.generateRandomNumber();
				const isUpdated = await dbService.updateUser(data);
				if (isUpdated) {
					res.statusCode = 200;
					result = { email: data.email, otp: data.otp };
				}
			} else {
				res.statusCode = 404;
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("resend otp api failed :: ", error);
	} finally {
		return result;
	}
}
module.exports = { createUser, verifyUser, updateUser, getUserByEmailAndPassword, getUserByEmail, resendOtp };

// async function createUser(req, res) {
// 	let result = null;
// 	try {
// 		res.statusCode = 500;
// 		const params = req.body;
// 		if (params && params.email && params.name && params.zip_code) {
// 			// required parameters - email, name, zip_code
// 			params.otp = commonUtils.generateRandomNumber();
// 			params.secret_key = commonUtils.encryptStr(params.password);
// 			const isCreated = await dbService.createUser({ ...params, ...{} });
// 			if (isCreated) {
// 				res.statusCode = 201;
// 				delete params.secret_key;
// 				result = { email: params.email, otp: params.otp };
// 			}
// 		} else {
// 			res.statusCode = 400;
// 		}
// 	} catch (error) {
// 		console.error("create user api failed :: ", error);
// 	} finally {
// 		return result;
// 	}
// }
