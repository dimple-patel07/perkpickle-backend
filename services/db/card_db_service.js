const dbService = require("./db_service");

// cards table
async function createCardsTable() {
	return new Promise(async (resolve) => {
		const sql = `CREATE TABLE IF NOT EXISTS cards (
            id SERIAL,
            card_key VARCHAR(255) primary key,
            card_name VARCHAR(255) not null,
            card_issuer VARCHAR(255) not null,
            card_image_url VARCHAR(255) not null,
            is_disabled BOOLEAN DEFAULT false,
            created_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
            modified_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
        )`;
		const client = await dbService.connectDb();
		let isCreated = false;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("cards table creation error :: ", error);
				} else {
					isCreated = true;
					console.log("cards table created");
				}
				await dbService.disConnectDb();
				resolve(isCreated);
			});
		} else {
			resolve(isCreated);
		}
	});
}
// create card
function createCard(data) {
	return new Promise(async (resolve) => {
		const sql = `INSERT INTO cards (card_key, card_name, card_issuer, card_image_url, is_disabled) VALUES (
            '${data.card_key}',
            '${data.card_name}',
            '${data.card_issuer}',
            '${data.card_image_url}',
            ${data.is_disabled ? data.is_disabled : false}
        )`;
		console.log("data-------", data);
		const client = await dbService.connectDb();
		let isInserted = false;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("card creation error :: ", error);
				} else {
					isInserted = true;
					console.log("card created successfully");
				}
				await dbService.disConnectDb();
				resolve(isInserted);
			});
		} else {
			resolve(isInserted);
		}
	});
}
// update card
function updateCard(data) {
	return new Promise(async (resolve) => {
		const sql = `UPDATE cards SET
            card_key = '${data.card_key}',
            card_name = '${data.card_name}',
            card_issuer = '${data.card_issuer}',
            card_image_url = '${data.card_image_url}',
            is_disabled = ${data.is_disabled ? data.is_disabled : false}
            modified_date = NOW()
            WHERE card_key = '${data.card_key}'`;
		console.log("data-------", data);
		const client = await dbService.connectDb();
		let isUpdated = false;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("card updation error :: ", error);
				} else {
					isUpdated = true;
					console.log("card updated successfully");
				}
				await dbService.disConnectDb();
				resolve(isUpdated);
			});
		} else {
			resolve(isUpdated);
		}
	});
}
// get all cards
function getAllCards() {
	return new Promise(async (resolve) => {
		const sql = `SELECT * from cards`;
		const client = await dbService.connectDb();
		let cardList = [];
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("card selection error :: ", error);
				} else if (result?.rows?.length > 0) {
					cardList = result.rows;
				}
				await dbService.disConnectDb();
				resolve(cardList);
			});
		} else {
			resolve(cardList);
		}
	});
}
// get card by card key
function getCardByCardKey(cardKey) {
	return new Promise(async (resolve) => {
		const sql = `SELECT * from cards where card_key='${cardKey}'`;
		const client = await dbService.connectDb();
		let found = null;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("card selection error :: ", error);
				} else if (result?.rows?.length > 0) {
					found = result.rows[0];
				}
				await dbService.disConnectDb();
				resolve(found);
			});
		} else {
			resolve(found);
		}
	});
}
module.exports = { createCardsTable, createCard, updateCard, getAllCards, getCardByCardKey };
