const bcrypt = require("bcryptjs");
const User = require("../models/User");
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

module.exports = authController;
