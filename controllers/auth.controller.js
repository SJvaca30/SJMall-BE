const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const authController = {};

authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // token
        const token = await user.generateToken();
        return res.status(200).json({
          status: "success",
          message: "로그인 성공! 토큰 생성!",
          user,
          token,
        });
      }
    }
    // throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
    return res.status(400).json({
      status: "fail",
      error: "이메일 또는 비밀번호가 일치하지 않습니다.",
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

authController.authenticate = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      return res.status(400).json({
        status: "fail",
        error: "토큰이 없습니다.",
      });
    }
    const token = tokenString.replace("Bearer ", "");

    // 1. jwt.verify 비동지 처리
    // 2. 에러 로직 수정
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(decoded);
        }
      });
    });

    req.userId = decoded._id;
    next(); // authController.authenticate 끝나고 userController.getUser 실행
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error: "토큰이 유효하지 않습니다.",
    });
  }
};

authController.checkAdminPermission = async (req, res, next) => {
  try {
    // Token 검증
    const { userId } = req;
    const user = await User.findById(userId);
    if (user.level !== "admin") {
      return res.status(400).json({
        status: "fail",
        error: "admin 권한이 없습니다.",
      });
    }
    next();
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = authController;
