const express = require('express');
const { body, validationResult } = require("express-validator")

const managerRouter = express.Router();
const managerController = require('../controllers/managerController');
const upload = require('../middleware/imageUpload');
const { isAdmin, isAdminOrManager } = require('../middleware/auth');

managerRouter.get('/managers',isAdminOrManager, managerController.getManagers)

managerRouter.get('/manager/:managerId', managerController.getManagerById)

managerRouter.post('/add-manager',
  isAdmin,
  upload.single("managerImage"),
  [
    body("managerName")
      .notEmpty().withMessage("Manager name is required")
      .isLength({ min: 2 }).withMessage("Name should be 2 characters long"),

    body("managerMobile")
      .notEmpty().withMessage("Contact number is required"),

    body("managerDob")
      .notEmpty().withMessage("Date of birth is required")
      .isBefore(new Date().toISOString().split("T")[0])
      .withMessage("Date of birth cannot be in the future"),

    body("managerGender")
      .notEmpty().withMessage("Gender is required")
      .isIn(["male", "female"])
      .withMessage("Gender must be either male or female")
  ],
  managerController.postAddManager)

managerRouter.delete('/manager/:managerId',isAdmin, managerController.deleteManager)

managerRouter.put('/manager/:managerId',
  isAdmin,
  upload.single("managerImage"), 
  [
    body("managerName")
      .isLength({ min: 2 }).withMessage("Name should be 2 characters long"),

    body("managerMobile")
      .notEmpty().withMessage("Contact number is required"),

    body("managerDob")
      .notEmpty().withMessage("Date of birth is required")
      .isBefore(new Date().toISOString().split("T")[0])
      .withMessage("Date of birth cannot be in the future"),

    body("managerGender")
      .isIn(["male", "female"])
      .withMessage("Gender must be either male or female")
  ],
  managerController.updateManager)

managerRouter.post('/reports' , isAdminOrManager,managerController.generateReport)

module.exports = managerRouter;