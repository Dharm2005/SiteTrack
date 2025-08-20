const express = require('express');

const siteRouter = express.Router();
const siteController = require('../controllers/siteController')

siteRouter.get('/',siteController.getSites)
siteRouter.post('/add-site',siteController.postAddSite)
// siteRouter.delete('/:id',siteController.deleteSite)

module.exports = siteRouter;