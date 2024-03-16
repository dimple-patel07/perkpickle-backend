// get all cards from static json list
const cardDbService = require("../../services/db/card_db_service");
const commonUtils = require("../../services/utils/common_utils");
const rapidApi = require("./rapid_api");

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
				if (params.card_detail === undefined) {
					// consider that all filed will be pass for update operation except card_detail, modified_date, created_date
					params.card_detail = data.card_detail;
				}
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
		cards = cards.filter((card) => !card.is_disabled); // return only active cards
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

async function findAllCards(req, res) {
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
// get card detail by card key
async function getCardDetail(req, res) {
	let card = null;
	try {
		const params = req.body;
		if (params && params.card_key) {
			// required parameters - card_key
			const data = await checkAndUpdateCard(params.card_key);
			if (data?.card_key) {
				card = data;
				res.statusCode = 200;
			}
		}
	} catch (error) {
		console.error("get card detail api error :: ", error);
	} finally {
		return card;
	}
}
// add list of new cards
async function addNewCards(req, res) {
	let msg = "";
	try {
		res.statusCode = 200;
		let counter = 0;
		const newCards = req.body;
		if (newCards?.length > 0) {
			for (const newCard of newCards) {
				const isCreated = await checkAndAddNewCard(newCard);
				if (isCreated) {
					counter = counter + 1;
				}
			}
			msg = `${counter} card(s) saved successfully`;
		}
	} catch (error) {
		// res.statusCode = 500;
		msg = error;
	} finally {
		console.log(msg);
		return msg;
	}
}

// add new card details - when not found from existing card list
async function checkAndAddNewCard(newCard) {
	return new Promise(async (resolve) => {
		let savedCard = await cardDbService.getCardByCardKey(newCard.cardKey);
		if (!savedCard) {
			// new card as not showing in the existing database
			const cardData = {
				card_key: newCard.cardKey,
				card_name: newCard.cardName.replaceAll("'", ""),
				card_issuer: newCard.cardIssuer.replaceAll("'", ""),
				is_disabled: false,
			};
			setTimeout(async () => {
				const cardImage = await rapidApi.processRequest(`creditcard-card-image/${cardData.card_key}`);
				if (cardImage?.length > 0 && cardImage[0].cardImageUrl) {
					cardData.card_image_url = cardImage[0].cardImageUrl;
				}
				const isCreated = await cardDbService.createCard(cardData);
				if (isCreated) {
					console.log(`${newCard.cardKey} created successfully`);
					resolve(isCreated);
				} else {
					resolve(null);
				}
			}, 400);
		}
	});
}

// check and update card
async function checkAndUpdateCard(cardKey) {
	return new Promise(async (resolve) => {
		try {
			let cardData = await cardDbService.getCardByCardKey(cardKey);
			if (cardData && cardData.card_key && !cardData.is_disabled) {
				// card should be active
				if (!cardData.card_detail || !commonUtils.checkTimeLimit(cardData.card_detail.added_time)) {
					// card detail not available (or) card detail is expired (older than 24 hours)
					const cardDetail = await rapidApi.processRequest(`creditcard-detail-bycard/${cardKey}`);
					// card detail response in array format [response]
					if (cardDetail?.length > 0 && cardDetail[0].cardKey) {
						cardData.card_detail = constructCardDetail(cardDetail[0]);
						const isUpdated = await cardDbService.updateCard(cardData);
						if (isUpdated) {
							console.log(`${cardKey} updated successfully`);
						}
					}
				}
				resolve(cardData);
			} else {
				resolve(null);
			}
		} catch (error) {
			console.error("check and update card method failed :: ", error);
		}
	});
}
// construct card detail :: !signupBonusDesc => !spendBonusDesc => benefitDesc
function constructCardDetail(data) {
	if (!data.signupBonusDesc) {
		if (data.spendBonusCategory?.length > 0) {
			data.spendBonusCategory.sort((a, b) => (a.earnMultiplier < b.earnMultiplier ? 1 : -1));
			data.signupBonusDesc = data.spendBonusCategory[0].spendBonusDesc;
		} else if (data.benefit?.length > 0) {
			data.signupBonusDesc = data.benefit[0].benefitDesc;
		}
	}
	return {
		added_time: Date.now(), // consider added_time never set null value
		baseSpendEarnCategory: data.baseSpendEarnCategory.replaceAll("'", ""),
		baseSpendEarnType: data.baseSpendEarnType.replaceAll("'", ""),
		baseSpendEarnCurrency: data.baseSpendEarnCurrency.replaceAll("'", ""),
		baseSpendEarnIsCash: data.baseSpendEarnIsCash,
		baseSpendAmount: data.baseSpendAmount,
		cardUrl: data.cardUrl,
		signupBonusDesc: data.signupBonusDesc.replaceAll("'", ""),
	};
}
// get dashboard count
async function getDashboardCount(req, res) {
	let cards = [];
	try {
		cards = await cardDbService.dashboardCount();
		res.statusCode = 200;
	} catch (error) {
		console.error("get all cards count api failed :: ", error);
	} finally {
		return cards;
	}
}
module.exports = { getAllCards, getCardByCardKey, createCard, updateCard, deleteCard, findAllCards, getCardDetail, addNewCards, getDashboardCount };
