const express = require("express");
const router = express.Router();
const AuthController = require("../Controllers/AuthController");
const verifyToken = require("../middlewares/auth");

// @route GET v1/auth
// @desc Check if user ids logged in
// @access Public
router.get("/", verifyToken, AuthController.checkUser);

// @route POST v1/auth/register
// @desc Register user
// @access Public
router.post("/register", AuthController.registerUser);

// @route POST v1/auth/login
// @desc Login user
// @access Private
router.post("/login", AuthController.loginUser);

module.exports = router;
