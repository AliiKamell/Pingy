const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");


// Route definition
router.route("/").post(userControllers.registerUser);
router.route("/friends").get(userControllers.getAllFriends);
router.route("/login").post(userControllers.login);

module.exports = router;
