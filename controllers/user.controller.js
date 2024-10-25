const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const userController = {};

userController.createUser = async (req, res) => {
  try {
    let { email, password, name, level } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: "fail",
        message: "이미 존재하는 이메일입니다.",
      });
    }

    const salt = await bcrypt.genSaltSync(10);
    password = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password,
      name,
      level: level ? level : "customer",
    });
    await newUser.save();

    // 아래처럼 작성하지 않는 이유는 await newUser.save(); 하기 전에 데이터 검증코드를 추가하거나 미들웨어(pre/post hooks)를 더 세밀하게 제어 가능하기 때문이다.
    // const newUser = await User.create({
    //   email,
    //   password,
    //   name,
    //   level: level ? level : "customer",
    // });

    return res.status(200).json({
      status: "success",
      message: "계정이 생성되었습니다.",
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports = userController;
