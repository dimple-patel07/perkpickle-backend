const cardDbService = require("./card_db_service");
const userDbService = require("./user_db_service");
const commonUtils = require("../utils/common_utils");
const rapidApi = require("../../api/card/rapid_api");

// only applicable for initial table setup
async function setup(req, res) {
	console.log("----------------initial setup started----------------");
	let msg;
	try {
		res.statusCode = 500;
		let isCreated = await cardDbService.createCardsTable(); // create cards table
		if (isCreated && isCreated) {
			await importAllCards(); // import cards json
			const cardList = await cardDbService.getAllCards(); // get all added cards(master-entries)
			if (cardList.length > 0) {
				// cards table created with master entries
				isCreated = await userDbService.createUserTable();
				if (isCreated) {
					// users table created
					// create admin user
					// INSERT INTO users (email, first_name, last_name,zip_code,address, phone_number, secret_key,is_verified, is_signup_completed, is_admin) VALUES (
					//     'admin@perkpickle.com',
					//     'admin','perkpickle','12345','NY','1234567890','UGVya3BpY2tsZUAxMjM=',
					//     true,true,true
					// )
					const params = {
						email: "admin@perkpickle.com",
						first_name: "admin",
						last_name: "perkpickle",
						zip_code: "12345",
						address: "NY",
						phone_number: "1234567890",
						password: "Perkpickle@123",
						is_verified: true,
						is_signup_completed: true,
						is_admin: true,
					};
					const isAdminCreated = await userDbService.createUserAdmin(params);
					if (isAdminCreated) {
						console.log("admin created successfully");
					}
					// create client user
					const data = {
						email: "help@perkpickle.com",
						otp: commonUtils.generateRandomNumber(),
					};
					const isCreated = await userDbService.createUser(data);
					if (isCreated) {
						// user created successfully
						// expecting valid otp - after otp entered going to update user scenario
						const userData = await userDbService.getUserByEmailAndOtp(data.email, data.otp);
						if (userData && userData.email) {
							userData.is_verified = true;
							userData.otp = null;
							userData.first_name = "perk";
							userData.last_name = "pickle";
							userData.zip_code = 73301;
							userData.address = "Austin Tx";
							userData.phone_number = "1(512)555-3890";
							userData.is_signup_completed = true;
							userData.secret_key = commonUtils.encryptStr("perkpickle@123"); // 'perkpickle@123' - 'cGVya3BpY2tsZUAxMjM'
						}
						let isUpdated = await userDbService.updateUser(userData);
						if (isUpdated) {
							// assuming saved card scenario
							const userCards = cardList.slice(0, 10);
							const cardKeys = userCards.map((userCard) => userCard.card_key);
							userData.card_keys = cardKeys.join(",");
							isUpdated = await userDbService.updateUser(userData);
							if (isUpdated) {
								res.statusCode = 200;
								msg = "setup successfully completed";
							}
						}
					}
				}
			}
		}
	} catch (error) {
		console.error("initial setup error :: ", error);
	} finally {
		if (!msg) {
			msg = "setup failed";
		}
		console.log("----------------initial setup completed----------------");
		return msg;
	}
}
// import cards
async function importAllCards() {
	// const savedCards = await cardDbService.getAllCards();
	const cards = require("../json/card-list-with-img.json");

	let counter = 0;
	for (const card of cards) {
		const found = await cardDbService.getCardByCardKey(card.card_key);
		if (!found) {
			const isInserted = await cardDbService.createCard(card);
			if (!isInserted) {
				counter = counter + 1;
				console.log("card insertion failed");
			}
		}

		// const found = await cardDbService.getCardByCardKey(card.cardKey);
		// if (!found) {
		// 	const cardImageResponse = await rapidApi.processRequest(`creditcard-card-image/${card.cardKey}`);
		// 	card.card_key = card.cardKey;
		// 	card.card_name = card.cardName.replaceAll("'", "");
		// 	card.card_issuer = card.cardIssuer.replaceAll("'", "");

		// 	if (cardImageResponse?.length > 0 && cardImageResponse[0].cardImageUrl) {
		// 		card.card_image_url = cardImageResponse[0].cardImageUrl;
		// 	}
		// 	const isInserted = await cardDbService.createCard(card);
		// 	if (!isInserted) {
		// 		console.log("card----", card);
		// 		counter = counter + 1;
		// 		console.log("card insertion failed");
		// 	}
		// }
	}
	console.log("no of cards inserted :: ", cards.length - counter);
	console.log("no of cards insertion failed :: ", counter);
	// if (savedCards.length === 0 || cards.length !== savedCards.length) {

	// } else {
	// 	console.log("required cards available");
	// }
}
module.exports = { setup };
