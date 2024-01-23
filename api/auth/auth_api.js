const dbService = require("../../services/db/db_service");
const commonUtils = require("../../services/utils/common_utils");
// login
async function login(req, res) {
	let result = null;
	try {
		res.statusCode = 500;
		if (req.body.key) {
			let params = commonUtils.decryptStr(req.body.key);
			if (params) {
				params = JSON.parse(params);
				if (params.email && params.password) {
					const data = await dbService.getUserByEmailAndPassword(params.email, params.password);
					if (data && data.email) {
						if (data.is_verified) {
							// must be verified user
							const str = JSON.stringify({ email: data.email, current_time: Date.now() });
							result = { token: commonUtils.encryptStr(str) };
							res.statusCode = 200;
						} else {
							result = { error: "unverified user" };
						}
					} else {
						result = { error: "invalid login" };
					}
				}
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("login api failed :: ", error);
	} finally {
		return result;
	}
}
// forgot password
async function forgotPassword(req, res) {
	let result = null;
	try {
		res.statusCode = 500;
		const email = req.body.email;
		if (email) {
			const data = await dbService.getUserByEmail(email);
			if (data && data.email) {
				data.otp = commonUtils.generateRandomNumber();
				const isUpdated = await dbService.updateUser(data);
				if (isUpdated) {
					result = { email: data.email, otp: data.otp };
					res.statusCode = 200;
				}
			} else {
				res.statusCode = 404;
				result = { error: "user not found" };
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("forgot api failed :: ", error);
	} finally {
		return result;
	}
}
// reset password
async function resetPassword(req, res) {
	let result = null;
	try {
		res.statusCode = 500;
		const key = req.body.key;
		if (key) {
			let params = commonUtils.decryptStr(key);
			if (params) {
				params = JSON.parse(params);
				if (params && params.email && params.otp && params.newPassword) {
					// email, otp & new password required
					const data = await dbService.getUserByEmailAndOtp(params.email, params.otp);
					if (data && data.email) {
						data.otp = null;
						data.secret_key = commonUtils.encryptStr(params.newPassword);
						const isUpdated = await dbService.updateUser(data);
						if (isUpdated) {
							result = { email: data.email };
							res.statusCode = 200;
						}
					}
				}
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("forgot api failed :: ", error);
	} finally {
		return result;
	}
}
// change password
async function changePassword(req, res) {
	let result = null;
	try {
		res.statusCode = 500;
		const key = req.body.key;
		if (key) {
			let params = commonUtils.decryptStr(key);
			if (params) {
				params = JSON.parse(params);
				if (params && params.email && params.password && params.newPassword) {
					// email, password & newPassword required
					const data = await dbService.getUserByEmailAndPassword(params.email, params.password);
					if (data && data.email && data.is_verified) {
						data.otp = null;
						data.secret_key = commonUtils.encryptStr(params.newPassword);
						const isUpdated = await dbService.updateUser(data);
						if (isUpdated) {
							result = { email: data.email };
							res.statusCode = 200;
						}
					}
				}
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("change password api failed :: ", error);
	} finally {
		return result;
	}
}

module.exports = { login, forgotPassword, resetPassword, changePassword };
