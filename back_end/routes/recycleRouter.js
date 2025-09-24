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

recycleRouter.delete('/expense/delete/:expenseId',isManager,recycleController.deleteExpense)
recycleRouter.patch('/expense/restore/:expenseId', isManager, recycleController.restoreExpense);

recycleRouter.delete('/worker/delete/:workerId',isManager,recycleController.deleteWorker)
recycleRouter.patch('/worker/restore/:workerId', isManager, recycleController.restoreWorker);

recycleRouter.delete('/memo/delete/:memoId',isManager,recycleController.deleteMemo)
recycleRouter.patch('/memo/restore/:memoId', isManager, recycleController.restoreMemo);

module.exports = recycleRouter