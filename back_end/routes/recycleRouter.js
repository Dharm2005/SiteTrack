const express = require('express');

const recycleRouter = express.Router()
const recycleController = require('../controllers/recycleController');
const { isAdmin, isManager } = require('../middleware/auth');

recycleRouter.get('/getDeletedSites',isAdmin,recycleController.getDeletedSites);
recycleRouter.get('/getDeletedManagers',isAdmin,recycleController.getDeletedManagers);

recycleRouter.get('/getDeletedWorkers/:siteId',isManager,recycleController.getDeletedWorkers)

module.exports = recycleRouter