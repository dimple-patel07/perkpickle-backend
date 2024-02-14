// get all cards from static json list
const cardDbService = require("../../services/db/card_db_service");

// create card
async function createCard(req, res) {
	let result = null;
	try {
		res.statusCode = 500;
		const params = req.body;
		if (params && params.card_key && params.card_name && params.card_issuer && params.card_image_url) {
			// required parameters - card_key, card_name, card_issuer,card_image_url
			const data = await cardDbService.getCardByCardKey(params.card_key);
			if (data && data.card_key) {
				result = { error: "card already exist" };
			} else {
				const isCreated = await cardDbService.createCard(params);
				if (isCreated) {
					// success
					res.statusCode = 201;
					result = { card_key: params.card_key, message: "card created successfully" };
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
			// required parameters - card_key
			const data = await cardDbService.getCardByCardKey(params.card_key);
			if (data) {
				const isUpdated = await cardDbService.updateCard(params);
				if (isUpdated) {
					res.statusCode = 200;
					result = { card_key: data.card_key, message: "card updated successfully" };
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
async function getCardByCardKey(req, res) {
	let card = null;
	try {
		const params = req.body;
		res.statusCode = 500;
		if (params && params.card_key) {
			// required parameters - card_key
			const data = await cardDbService.getCardByCardKey(params.card_key);
			if (data?.card_key) {
				card = data;
				res.statusCode = 200;
			} else {
				res.statusCode = 404;
			}
		}
	} catch (error) {
		console.error("get card by card key error :: ", error);
	} finally {
		return card;
	}
}
// delete card
async function deleteCard(req, res) {
	let result = null;
	try {
		const params = req.body;
		res.statusCode = 500;
		if (params && params.card_key) {
			// required parameters - card_key,
			const data = await cardDbService.getCardByCardKey(params.card_key);
			if (data) {
				const isDeleted = await cardDbService.deleteCard(data.card_key);
				if (isDeleted) {
					res.statusCode = 200;
					result = { card_key: data.card_key, message: "card deleted successfully" };
				}
			} else {
				res.statusCode = 404;
			}
		} else {
			res.statusCode = 400;
		}
	} catch (error) {
		console.error("delete card api failed :: ", error);
	} finally {
		return result;
	}
}

async function findAllCards(req, res){
	let cards = [];
	try {
		cards = await cardDbService.findAllCards(req);
		res.statusCode = 200;
	} catch (error) {
		console.error("get all cards api failed :: ", error);
	} finally {
		return cards;
	}
}
module.exports = { getAllCards, createCard, updateCard, getCardByCardKey, deleteCard, findAllCards };
