const { User } = require("./../models");
const authController = require("../controller/userController");
const express = require("express");
const router = express.Router();
router.post("/signup", authController.signUp);
router.post("/login", authController.login);

module.exports = router;
