const express = require('express');

const siteRouter = express.Router();
const siteController = require('../controllers/siteController');
const upload = require('../middleware/imageUpload');

siteRouter.get('/',siteController.getSites)
siteRouter.post('/add-site',upload.single("siteImage"),siteController.postAddSite)
siteRouter.get('/site/:siteId',siteController.getSiteDetails)
siteRouter.delete('/site/:siteId',siteController.deleteSite)

module.exports = siteRouter;