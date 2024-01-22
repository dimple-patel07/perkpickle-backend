async function login(req, res) {
	const email = req.body.email;
	const password = req.body.password;
	return email === "test" && password === "test";
}

async function forgotPassword(req, res) {
	const email = "test@test.com";
	const otp = email === "test@test.com" ? 123 : 444;
	return otp;
}

async function resetPassword(req, res) {
	const otp = req.body.otp;
	const email = req.body.email;
	const password = "xyz";
	return email === "test@test.com" && otp === 123 && password === "xyz";
}

async function changePassword(req, res) {
	const password = req.body.password;
	const newPassword = req.body.newPassword;
	return password === "xyz" && newPassword === "pqr";
}

async function createUser(req, res) {
	const name = req.body.name;
	return name === "abc";
}

async function updateUser(req, res) {
	const name = req.body.name;
	return name === "new-abc";
}

module.exports = { login, forgotPassword, resetPassword, changePassword, createUser, updateUser };
