const express = require('express');

const recycleRouter = express.Router()
const recycleController = require('../controllers/recycleController');
const { isAdmin } = require('../middleware/auth');

recycleRouter.get('/getDeletedSites',isAdmin,recycleController.getDeletedSites);
recycleRouter.get('/getDeletedManagers',isAdmin,recycleController.getDeletedManagers);

module.exports = recycleRouter