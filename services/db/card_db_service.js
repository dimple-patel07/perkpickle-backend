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
// create new card
function createCard(data) {
	return new Promise(async (resolve) => {
		const sql = `INSERT INTO cards (card_key, card_name, card_issuer, card_image_url, is_disabled, card_detail) VALUES (
            '${data.card_key}',
            '${data.card_name}',
            '${data.card_issuer}',
            ${data.card_image_url ? `'${data.card_image_url}'` : null},
            ${data.is_disabled ? data.is_disabled : false},
            ${data.card_detail ? `'${JSON.stringify(data.card_detail)}'` : null}
        )`;
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
            is_disabled = ${data.is_disabled ? data.is_disabled : false},
            card_detail = ${data.card_detail ? `'${JSON.stringify(data.card_detail)}'` : null},
            modified_date = NOW()
            WHERE card_key = '${data.card_key}'`;
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
// get list of cards
function getListOfCards(cardKeys) {
	return new Promise(async (resolve) => {
		const sql = `SELECT * from cards where card_key in(${cardKeys})`;
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
// delete card
function deleteCard(cardKey) {
	return new Promise(async (resolve) => {
		const sql = `DELETE from cards
            WHERE card_key = '${cardKey}'`;
		const client = await dbService.connectDb();
		let isDeleted = false;
		if (client) {
			client.query(sql, async (error, result) => {
				if (error) {
					console.error("card deletion error :: ", error);
				} else if (result?.rowCount) {
					isDeleted = true;
					console.log("card deleted successfully");
				}
				await dbService.disConnectDb();
				resolve(isDeleted);
			});
		} else {
			resolve(isDeleted);
		}
	});
}

function findAllCards(req) {
	return new Promise(async (resolve) => {
		let page = parseInt(req.body.pageNumber);
		let limit = parseInt(req.body.pageSize);
		let sortby = req.body.sortBy;
		let sortorder = req.body.sortOrder;
		let search = req.body.search;
		const offset = page ? (page - 1) * limit : 0;

		const sql = `SELECT count(*) as total from cards where card_key like '%${search}%' OR card_name like '%${search}%' OR card_name like '%${search}%' OR card_issuer like '%${search}%'`;
		const client = await dbService.connectDb();

		let cardList = [];
		let count = 0;
		let dataRes = {
			totalCount: 0,
			pageNumber: page,
			pageSize: limit,
			sortBy: sortby,
			sortOrder: sortorder,
			search: search,
			data: [],
		};
		if (client) {
			client.query(sql, async (error, result) => {
				count = result.rows[0].total;
				console.log(count);
				if (error) {
					console.error("card selection error :: ", error);
				} else {
					const sql2 = `SELECT * from cards where card_key like '%${search}%' OR card_name like '%${search}%' OR card_name like '%${search}%' OR card_issuer like '%${search}%' ORDER BY ${sortby} ${sortorder} limit ${limit} offset ${offset}`;
					client.query(sql2, async (error, resultData) => {
						if (error) {
							console.error("card selection error :: ", error);
						}
						if (resultData?.rows?.length > 0) {
							cardList = resultData.rows;
							dataRes = {
								totalCount: parseInt(count),
								pageNumber: page,
								pageSize: limit,
								sortBy: sortby,
								sortOrder: sortorder,
								search: search,
								data: resultData.rows,
							};
						}
						await dbService.disConnectDb();
						resolve(dataRes);
					});
				}
			});
		} else {
			resolve(dataRes);
		}
	});
}

function dashboardCount(req){
	return new Promise(async (resolve) => {

	const sql = `SELECT count(*) as total from cards where is_disabled = false `;
	const client = await dbService.connectDb();
	
	let count = 0;
	let userCount = 0;
	let dataRes = {
		user:0,
		card:0
	}
	if (client) {
		client.query(sql, async (error, result) => {
			count = result.rows[0].total;
			if (error) {
				console.error("card selection error :: ", error);
			} else {
			const sql2 = `SELECT count(*) as totaluser from users where is_signup_completed = true `;
				client.query(sql2, async (error, resultData) => {
				if (error) {
					console.error("user selection error :: ", error);
				}
				userCount = resultData.rows[0].totaluser;
					dataRes = {
						user:userCount,
						card:count
					};
					await dbService.disConnectDb();
					resolve(dataRes);
			})
			}
			
		});
	} else {
		resolve(dataRes);
	}
	});
}
module.exports = { createCardsTable, createCard, updateCard, getAllCards, getCardByCardKey, deleteCard, getListOfCards, findAllCards,dashboardCount };
