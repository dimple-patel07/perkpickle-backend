const userDbService = require("../../services/db/user_db_service");
const commonUtils = require("../../services/utils/common_utils");
const authMailer = require("../../mailer/auth_mailer");
// login
async function login(req, res) {
	let result = null;
	try {
		result = { error: "invalid login details" };
		res.statusCode = 400;
		if (req.body.key) {
			let params = commonUtils.decryptStr(req.body.key);
			if (params) {
				params = JSON.parse(params);
				if (params.email && params.password) {
					const data = await userDbService.getUserByEmailAndPassword(params.email, params.password);
					if (data && data.email) {
						if (data.is_verified) {
							// must be verified user
							if (data.is_signup_completed) {
								// must be signup process completed
								let userName;
								if (data.first_name && data.last_name) {
									userName = `${data.first_name} ${data.last_name}`;
								} else {
									userName = data.email;
								}
								const str = JSON.stringify({ email: data.email, current_time: Date.now() });
								result = { token: commonUtils.encryptStr(str), userName };
								res.statusCode = 200;
							} else {
								// signup process pending
								result = { error: "user is not registered" };
							}
						} else {
							// email verification pending
							result = { error: "email verification pending" };
						}
					} else {
						res.statusCode = 500;
						result = { error: "email or password doesn't match" };
					}
				}
			}
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
			const data = await userDbService.getUserByEmail(email);
			if (data && data.email) {
				if (data.is_signup_completed) {
					data.otp = commonUtils.generateRandomNumber();
					const isUpdated = await userDbService.updateUser(data);
					if (isUpdated) {
						// success
						result = { email: data.email, message: "otp sent successfully" };
						res.statusCode = 200;
						// send email
						authMailer.sendForgotPasswordEmail(data.email, data.otp);
					}
				} else {
					// signup process pending
					result = { error: "user is not registered" };
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
				if (params && params.email && params.newPassword) {
					// email, otp & new password required
					const data = await userDbService.getUserByEmail(params.email);
					if (data && data.email && !data.otp) {
						// data.otp blank - otp should be verified;
						data.secret_key = commonUtils.encryptStr(params.newPassword);
						const isUpdated = await userDbService.updateUser(data);
						if (isUpdated) {
							result = { email: data.email, message: "password reset successfully" };
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
					const data = await userDbService.getUserByEmailAndPassword(params.email, params.password);
					if (data && data.email && data.is_verified) {
						data.otp = null;
						data.secret_key = commonUtils.encryptStr(params.newPassword);
						const isUpdated = await userDbService.updateUser(data);
						if (isUpdated) {
							result = { email: data.email, message: "password changed successfully" };
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
