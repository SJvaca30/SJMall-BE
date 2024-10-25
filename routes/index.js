const express = require("express");
const router = express.Router();
const userApi = require("./user.api");

router.use("/user", userApi); // /user로 들어오는 모든 요청을 userApi 라우터로 전달한다.

module.exports = router;
