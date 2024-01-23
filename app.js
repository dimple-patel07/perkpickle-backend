const express = require("express");
const app = express();
app.use(express.json()); //Add it first then others follw
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});

app.use(express.urlencoded({ extended: true }));
require("dotenv").config();

const rapidApi = require("./api/card/rapid_api");
const authApi = require("./api/auth/auth_api");
const userApi = require("./api/user/user_api");

const initialSetup = require("./services/db/initial_setup");
// ----------------------- card api -----------------------
// Get Spend Bonus Category List
app.get("/spendBonusCategoryList", async (req, res) => {
	res.send(await rapidApi.spendBonusCategoryList(req, res));
});

// Get Spend Bonus Category Card By Category Id
app.post("/spendBonusCategoryCard", async (req, res) => {
	res.send(await rapidApi.spendBonusCategoryCard(req, res));
});

// Get Card Detail By Card Key
app.post("/cardDetailByCardKey", async (req, res) => {
	res.send(await rapidApi.cardDetailByCardKey(req, res));
});

// Get Credit Card Image
app.post("/getCardImage", async (req, res) => {
	res.send(await rapidApi.getCardImage(req, res));
});

// get list of cards
app.get("/getAllCards", async (req, res) => {
	res.send(rapidApi.getAllCards(req, res));
});

// ----------------------- auth api -----------------------
// login
app.post("/login", async (req, res) => {
	res.send(await authApi.login(req, res));
});

// forgot password
app.post("/forgotPassword", async (req, res) => {
	res.send(await authApi.forgotPassword(req, res));
});

// reset password
app.post("/resetPassword", async (req, res) => {
	res.send(await authApi.resetPassword(req, res));
});

// change password
app.post("/changePassword", async (req, res) => {
	res.send(await authApi.changePassword(req, res));
});

// ----------------------- user api -----------------------
// create user
app.post("/createUser", async (req, res) => {
	res.send(await userApi.createUser(req, res));
});

// verify user
app.post("/verifyUser", async (req, res) => {
	res.send(await userApi.verifyUser(req, res));
});

// get user
app.post("/getUserByEmail", async (req, res) => {
	res.send(await userApi.getUserByEmail(req, res));
});

// ----------------------- initial setup -----------------------
// setup
app.post("/initialSetup", async (req, res) => {
	res.send(await initialSetup.setup(req, res));
});
app.listen(process.env.PORT);
