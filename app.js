const express = require("express");
const cors = require("cors");
const rapidApi = require("./api/card/rapid_api");
const authApi = require("./api/auth/auth_api");
const userApi = require("./api/user/user_api");
const contactMailer = require("./mailer/contact_mailer");
const cardApi = require("./api/card/card_api");
const initialDbSetup = require("./services/db/initial_db_service");
const { handleApiRequest } = require("./services/utils/common_utils");
const { updateCardImage } = require("./services/migrations/1708171173876_update_card_image");
require("dotenv").config();
const app = express();
app.use(express.json()); //Add it first then others
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
	handleApiRequest(req, res, next);
});

// ----------------------- rapid api -----------------------
// Get Spend Bonus Category List - return list of categories
app.post("/spendBonusCategoryList", async (req, res) => {
	res.send(await rapidApi.spendBonusCategoryList(req, res));
});

// Get Spend Bonus Category Card By Category Id - return offers for specific category
app.post("/spendBonusCategoryCard", async (req, res) => {
	res.send(await rapidApi.spendBonusCategoryCard(req, res));
});

// Get Card Detail By Card Key - return specific card detail
app.post("/cardDetailByCardKey", async (req, res) => {
	res.send(await rapidApi.cardDetailByCardKey(req, res));
});

// Get Card Image - return specific card image
app.post("/getCardImage", async (req, res) => {
	res.send(await rapidApi.getCardImage(req, res));
});

// ----------------------- card api -----------------------

// get list of cards - return all the cards
app.post("/getAllCards", async (req, res) => {
	res.send(await cardApi.getAllCards(req, res));
});

// get card by card key - return specific card detail
app.post("/getCardByCardKey", async (req, res) => {
	res.send(await cardApi.getCardByCardKey(req, res));
});

// create card
app.post("/createCard", async (req, res) => {
	res.send(await cardApi.createCard(req, res));
});

// update card
app.post("/updateCard", async (req, res) => {
	res.send(await cardApi.updateCard(req, res));
});

// delete card
app.post("/deleteCard", async (req, res) => {
	res.send(await cardApi.deleteCard(req, res));
});

// get card detail
app.post("/getCardDetail", async (req, res) => {
	res.send(await cardApi.getCardDetail(req, res));
});
// add list of new cards
app.post("/addNewCards", async (req, res) => {
	res.send(await cardApi.addNewCards(req, res));
});

// card list with pagination
app.post("/cards/all", async (req, res) => {
	res.send(await cardApi.findAllCards(req, res));
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
// new user signup - create new user from client
app.post("/newUserSignup", async (req, res) => {
	res.send(await userApi.createUser(req, res));
});

// create user from admin app
app.post("/createUser", async (req, res) => {
	res.send(await userApi.createUser(req, res));
});

// verify user
app.post("/verifyUser", async (req, res) => {
	res.send(await userApi.verifyUser(req, res));
});

// resend otp
app.post("/resendOtp", async (req, res) => {
	res.send(await userApi.resendOtp(req, res));
});

// get user
app.post("/getUserByEmail", async (req, res) => {
	res.send(await userApi.getUserByEmail(req, res));
});

// complete user signup
app.post("/completeUserSignup", async (req, res) => {
	res.send(await userApi.updateUser(req, res));
});

// update user
app.post("/updateUser", async (req, res) => {
	res.send(await userApi.updateUser(req, res));
});

// delete user
app.post("/deleteUser", async (req, res) => {
	res.send(await userApi.deleteUser(req, res));
});

// update user cards
app.post("/updateUserCards", async (req, res) => {
	res.send(await userApi.updateUserCards(req, res));
});

// get all users
app.post("/getAllUsers", async (req, res) => {
	res.send(await userApi.getAllUsers(req, res));
});

// get user with associated cards
app.post("/getUserWithAssociatedCards", async (req, res) => {
	res.send(await userApi.getUserWithAssociatedCards(req, res));
});

// ----------------------- send email-----------------------
// contact email
app.post("/contactMail", async (req, res) => {
	res.send(await contactMailer.sendContactMail(req, res));
});

// ----------------------- initial setup -----------------------
// setup
app.post("/initialSetup", async (req, res) => {
	res.send(await initialDbSetup.setup(req, res));
});
// ----------------------- migration ------temporary-----------------
// updateCardImage
app.post("/updateCardImage", async (req, res) => {
	res.statusCode = 200;
	res.send(await updateCardImage());
});
// Dashboar counting API
app.get("/dashboard/count", async (req, res) => {
	res.send(await cardApi.getDashboardCount(req, res));
});

//------------------ Admin User's API -------------------------------
// Admin Create user
app.post("/users/create", async (req, res) => {
	res.send(await userApi.createUserAdmin(req, res));
});
// ADMIN USER UPDATE
app.post("/users/update", async (req, res) => {
	res.send(await userApi.updateUserAdmin(req, res));
});
app.post("/users/all", async (req, res) => {
	res.send(await userApi.findAllUsers(req, res));
});

// login
app.post("/adminlogin", async (req, res) => {
	res.send(await authApi.adminlogin(req, res));
});

app.listen(process.env.PORT); // 3300 port number only for local system - on heroku production set automatically from inbuilt heroku config(process.env.PORT)
