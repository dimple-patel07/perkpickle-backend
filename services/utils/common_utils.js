const jwt = require("jsonwebtoken");

// generate random number including min & max (default setup for 6 digit user's otp )
function generateRandomNumber(min = 100000, max = 999999) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
// encryption
function encryptStr(str) {
	return btoa(str);
}
// decryption
function decryptStr(str) {
	return atob(str);
}
// generate token
function generateToken(email) {
	let data = {
		issue_time: Date.now(),
		token_email: email,
	};
	const token = jwt.sign(data, process.env.JWT_SECRET_KEY);
	return token;
}
// validate token
function validateToken(token) {
	let isVerified = false;
	try {
		const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
		if (data && data.issue_time && data.token_email) {
			const diff = Date.now() - data.issue_time;
			// const minutes = Math.floor(diff / 1000 / 60) % 60;
			const hours = Math.ceil(diff / 1000 / 60 / 60);
			console.log("hours----", hours);
			if (hours <= 24) {
				isVerified = true;
			}
		}
	} catch (error) {
		// Access Denied
	} finally {
		return isVerified;
	}
}
// check request
function handleApiRequest(req, res, next) {
	try {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		res.setHeader("Access-Control-Allow-Credentials", true);
		const excludeUrls = ["login", "forgotPassword", "resetPassword", "verifyUser", "resendOtp", "contactMail", "initialSetup", "newUserSignup", "completeUserSignup"]; // no need to check token for these urls
		if (excludeUrls.includes(req.url.replace("/", ""))) {
			next();
		} else {
			const token = req.headers.authorization;
			if (token) {
				const result = validateToken(token);
				if (result) {
					// token verified
					next();
				} else {
					// token expired
					unauthorizeResponse(res);
				}
			} else {
				unauthorizeResponse(res);
			}
		}
	} catch (error) {
		console.error("api request failed :: ", error);
		unauthorizeResponse(res);
	}
}
function unauthorizeResponse(res) {
	res.statusCode = 401;
	res.send({ error: "unauthorize request" });
}
module.exports = { generateRandomNumber, encryptStr, decryptStr, generateToken, validateToken, handleApiRequest };
