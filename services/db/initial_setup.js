const dbService = require("./db_service");
async function setup() {
	const isConnected = await dbService.connectDb();
	if (isConnected) {
	}
	const isDisconnected = await dbService.connectDb();
	if (isDisconnected) {
	}
}
