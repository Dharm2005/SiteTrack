const express = require('express');
const { body, validateResult } = require('express-validator')

const expenseRouter = express.Router();
const expenseController = require('../controllers/expenseController');
const upload = require('../middleware/imageUpload');

expenseRouter.get('/expense/:siteId',expenseController.getExpensesBySite)
expenseRouter.get('/expense/data/:expenseId',expenseController.getExpenseById)
expenseRouter.post('/add-expense',
  upload.single("billImage"),
  expenseController.postAddExpense)
expenseRouter.get('/expense/:siteId/filter',expenseController.getFilteredExpenses)

expenseRouter.delete('/expense/:expenseId',expenseController.deleteExpense)
expenseRouter.put('/expense/:expenseId',upload.single("billImage"),expenseController.updateExpense)

module.exports = expenseRouter;