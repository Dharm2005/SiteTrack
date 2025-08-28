const express = require('express');

const siteRouter = express.Router();
const siteController = require('../controllers/siteController');
const upload = require('../middleware/imageUpload');

siteRouter.get('/',siteController.getSites)
siteRouter.post('/add-site',upload.single("siteImage"),siteController.postAddSite)
// siteRouter.delete('/:id',siteController.deleteSite)
siteRouter.get('/site/:siteId',siteController.getSiteDetails)

module.exports = siteRouter;