const User = require('../models/User')

const dotenv = require('dotenv');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

dotenv.config();

exports.login = async (req, res, next) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => err.msg)
      })
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ message: "Invalid username of password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username of password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    })

  } catch (error) {
    console.error("error while login", error);
    res.status(500).json("Server Error")
  }
}

exports.signup = async (req, res, next) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => err.msg)
      })
    }

    const { username, password, role } = req.body;

    const existUser = await User.findOne({ username });
    if (existUser) {
      return res.status(400).json({ message: "Username alredy taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPass,
      role: role || 'admin'
    })

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.status(201).json({
      token,
      user: { id: newUser._id, username: newUser.username, role: newUser.role },
    });
  } catch (error) {
    console.error("Error while signup", error);

    res.status(500).json({ message: "Server error" });
  }
}

exports.changePassword = async (req, res, next) => {

  console.log(req.user);
  

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => err.msg)
      });
    }

    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ errors: ["User not found"] });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: ["Old password is incorrect"] });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPass },
      { new: true }
    );

    res.status(200).json({ updatedUser, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error while changing password", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};