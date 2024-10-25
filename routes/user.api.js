const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

//회원가입 /api/user
router.post("/", userController.createUser);

module.exports = router;
