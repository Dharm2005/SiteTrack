const express = require('express');

const expenseRouter = express.Router();
const expenseController = require('../controllers/expenseController');
const upload = require('../middleware/imageUpload');

expenseRouter.get('/expense/:siteId',expenseController.getExpensesBySite)
expenseRouter.post('/add-expense',upload.single("billImage"),expenseController.postAddExpense)
expenseRouter.get('/expense/:siteId/filter',expenseController.getFilteredExpenses)

expenseRouter.delete('/expense/:expenseId',expenseController.deleteExpense)

module.exports = expenseRouter;