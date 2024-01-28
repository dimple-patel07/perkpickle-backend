// get all cards from static json list
const cardDbService = require("../../services/db/card_db_service");

// create card
async function createCard(req, res) {
	let result = null;
	try {
		res.statusCode = 500;
		const params = req.body;
		if (params && params.card_key) {
			// required parameters - card_key, card_name, card_issuer
			const data = await cardDbService.getCardByCardKey(params.card_key);
			if (data && data.card_key) {
				result = { error: "card already exist" };
			} else {
				const isCreated = await cardDbService.createCard(params);
				if (isCreated) {
					// success
					res.statusCode = 201;
				}
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("create card api failed :: ", error);
	} finally {
		return result;
	}
}
// update card
async function updateCard(req, res) {
	let result = null;
	try {
		const params = req.body;
		res.statusCode = 500;
		if (params && params.card_key) {
			// required parameters - card_key, card_name, card_issuer
			const data = await cardDbService.getCardByCardKey(params.card_key);
			if (data) {
				const isUpdated = await cardDbService.updateCard(params);
				if (isUpdated) {
					res.statusCode = 200;
					result = { card_key: params.card_key };
				}
			} else {
				res.statusCode = 404;
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("update card api failed :: ", error);
	} finally {
		return result;
	}
}
// get all cards
async function getAllCards(req, res) {
	let cards = [];
	try {
		cards = await cardDbService.getAllCards();
		res.statusCode = 200;
	} catch (error) {
		console.error("get all cards api failed :: ", error);
	} finally {
		return cards;
	}
}
// get card by card key
async function getCardByCardKey() {
	let card = null;
	try {
		card = await cardDbService.getCardByCardKey();
	} catch (error) {
		console.error("get card by card key error :: ", error);
	} finally {
		return card;
	}
}

module.exports = { getAllCards, createCard, updateCard, getCardByCardKey };
