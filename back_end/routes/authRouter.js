const express = require('express');
const { body, validationResult } = require("express-validator")

const authController = require('../controllers/authController');
const userRouter = express.Router();

userRouter.post('/login',
  [
    body("username")
      .notEmpty().withMessage("Username is required"),

    body("password")
      .notEmpty().withMessage("Password is required"),

    body("role")
      .isIn(['admin', 'manager'])
      .withMessage("Role must be either admin or manager")
  ],
  authController.login)
userRouter.post('/signup',
  [
    body("username")
      .notEmpty().withMessage("Username is required")
      .toLowerCase()
      .matches(/^(?=.*[a-z])[a-z0-9]+$/)
      .withMessage("Username must contain only lowercase letters and numbers"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number"),

    body("role")
      .isIn(['admin', 'manager'])
      .withMessage("Role must be either admin or manager")
  ],
  authController.signup)

module.exports = userRouter;