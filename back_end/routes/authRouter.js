const express = require('express');

const authController = require('../controllers/authController');
const userRouter = express.Router();

userRouter.post('/login',authController.login)
userRouter.post('/signup',authController.signup)

module.exports = userRouter;