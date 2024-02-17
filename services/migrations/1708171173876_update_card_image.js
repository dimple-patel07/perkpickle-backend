const { processRequest } = require("../../api/card/rapid_api");
const { getCardByCardKey, updateCard } = require("../db/card_db_service");

// corrected card-image for 21 cards ('undefined' to <cardImageUrl>)
const cardKeys = ["abbybank-secured", "towncountrybank-biz-cashpreffered", "towncountrybank-biz-smartrewards", "towncountrybank-maxcashpreferred", "towncountrybank-maxcashsecured", "towncountrybank-platinum", "towncountrybank-reserve", "towncountrybank-secured", "towncountrybank-travel", "townebank-biz-cashpreffered", "townebank-biz-real", "townebank-maxcashpreferred", "townebank-maxcashsecured", "townebank-platinum", "townebank-secured", "townebank-travel", "tricounties-biz-commercial", "tricounties-biz-fleet", "tricounties-visasig", "tricounties-cashrewards", "truist-biz-cashrewards"];
async function updateCardImageOld() {
	let successCounter = 0;
	for (const cardKey of cardKeys) {
		const response = await processRequest(`creditcard-card-image/${cardKey}`);
		if (response[0].cardImageUrl) {
			const card = await getCardByCardKey(cardKey);
			if (card) {
				card.card_image_url = response[0].cardImageUrl;
				const isUpdated = await updateCard(card);
				if (isUpdated) {
					successCounter = successCounter + 1;
					console.log(`Updated :: ${card.card_key} : ${card.card_image_url}`);
				}
			}
		}
	}
	return `${successCounter} records updated successfully`;
}
async function updateCardImage() {
	const allCards = require("../db/card-list-with-img.json");
	let successCounter = 0;
	for (const cardKey of cardKeys) {
		const foundCard = allCards.find((card) => card.card_key === cardKey);
		if (foundCard) {
			const isUpdated = await updateCard(foundCard);
			if (isUpdated) {
				successCounter = successCounter + 1;
				console.log(`Updated :: ${foundCard.card_key} : ${foundCard.card_image_url}`);
			}
		}
	}

	return `${successCounter} records updated successfully`;
}
module.exports = { updateCardImage };
