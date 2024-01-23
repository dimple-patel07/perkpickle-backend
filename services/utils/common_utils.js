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
module.exports = { generateRandomNumber, encryptStr, decryptStr };
