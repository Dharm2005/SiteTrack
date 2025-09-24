const express = require('express');

const recycleRouter = express.Router()
const recycleController = require('../controllers/recycleController');
const { isAdmin, isManager } = require('../middleware/auth');

recycleRouter.get('/getDeletedSites',isAdmin,recycleController.getDeletedSites);
recycleRouter.get('/getDeletedManagers',isAdmin,recycleController.getDeletedManagers);

recycleRouter.get('/getDeletedExpenses/:siteId',isManager,recycleController.getDeletedExpenses)
recycleRouter.get('/getDeletedWorkers/:siteId',isManager,recycleController.getDeletedWorkers)
recycleRouter.get('/getDeletedMemos/:siteId',isManager,recycleController.getDeletedMemos)


recycleRouter.delete('/site/delete/:siteId',isAdmin,recycleController.deleteSite)
recycleRouter.patch('/site/restore/:siteId', isAdmin, recycleController.restoreSite);

recycleRouter.delete('/manager/delete/:managerId',isAdmin,recycleController.deleteManager)
recycleRouter.patch('/manager/restore/:managerId', isAdmin, recycleController.restoreManager);


module.exports = recycleRouter