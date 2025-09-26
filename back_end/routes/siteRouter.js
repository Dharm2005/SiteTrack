const express = require('express');
const {body , validationResult} = require("express-validator")
const {isAdmin , isManager} = require('../middleware/auth')

const siteRouter = express.Router();
const siteController = require('../controllers/siteController');
const upload = require('../middleware/imageUpload');

siteRouter.get('/',siteController.getSites)

siteRouter.post('/add-site',
  isAdmin,
  upload.single("siteImage"),
  [
    body("siteName")
    .notEmpty().withMessage("Site name is required")
    .isLength({min : 2}).withMessage("Site name should be 2 character long"),

    body("location")
    .notEmpty().withMessage("Location is required"),

    body("managerId")
    .notEmpty().withMessage("Manager is required")
    .isMongoId().withMessage("Manager is not created")
  ],
  siteController.postAddSite)

siteRouter.get('/site/:siteId',siteController.getSiteDetails)

siteRouter.patch('/site/:siteId',isAdmin,siteController.markCompleted)

siteRouter.delete('/site/:siteId',isAdmin,siteController.deleteSite)

siteRouter.put('/site/:siteId',
  isAdmin,
  upload.single("siteImage"),
  [
    body("siteName")
    .notEmpty().withMessage("Site name is required")
    .isLength({min : 2}).withMessage("Site name should be 2 character long"),

    body("location")
    .notEmpty().withMessage("Location is required"),

    body("managerId")
    .notEmpty().withMessage("Manager is required")
    .isMongoId().withMessage("Manager is not created")
  ],
  siteController.updateSite)

module.exports = siteRouter;