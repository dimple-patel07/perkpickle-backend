const axios = require("axios");

// get category groups
async function spendBonusCategoryList(req, res) {
	console.log('in----');
	return await processRequest("creditcard-spendbonuscategory-categorylist");
}
// get group's categories
async function spendBonusCategoryCard(req, res) {
	const spendBonusCategoryId = req.body.spendBonusCategoryId;
	return await processRequest(`creditcard-spendbonuscategory-categorycard/${spendBonusCategoryId}`);
}
// get card detail by card key
async function cardDetailByCardKey(req, res) {
	const cardKey = req.body.cardKey;
	return await processRequest(`creditcard-detail-bycard/${cardKey}`);
}
// get card image by card key
async function getCardImage(req, res) {
	const cardKey = req.body.cardKey;
	return await processRequest(`creditcard-card-image/${cardKey}`);
}
// get all cards
function getAllCards(req, res) {
	const cards = require("./card_list.json");
	return cards;
}
// process request
function processRequest(url) {
	return new Promise((resolve) => {
		let result = undefined;
		const options = {
			method: "GET",
			url: `https://rewards-credit-card-api.p.rapidapi.com/${url}`,
			headers: {
				"X-RapidAPI-Key": process.env.X_RAPID_API_KEY,
				"X-RapidAPI-Host": process.env.X_RAPID_API_HOST,
			},
		};
		console.log('options-----',options);
		axios
			.request(options)
			.then((response) => {
				console.log('success------------');
				console.log('response-----',response.data?.length)
				result = response.data;
			})
			.catch((error) => {
				console.log('error--------');
				console.error(error);
			})
			.finally(() => {
				console.log('finaly---result---');
				console.log(result?.length)
				resolve(result);
			});
	});
}
module.exports = { spendBonusCategoryList, spendBonusCategoryCard, cardDetailByCardKey, getCardImage, getAllCards };
