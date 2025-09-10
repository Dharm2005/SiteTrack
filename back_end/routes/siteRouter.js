const express = require('express');
const {body , validationResult} = require("express-validator")

const siteRouter = express.Router();
const siteController = require('../controllers/siteController');
const upload = require('../middleware/imageUpload');

siteRouter.get('/',siteController.getSites)

siteRouter.post('/add-site',
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

siteRouter.delete('/site/:siteId',siteController.deleteSite)

siteRouter.put('/site/:siteId',upload.single("siteImage"),siteController.updateSite)

module.exports = siteRouter;