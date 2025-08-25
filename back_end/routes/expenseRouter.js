const express = require('express');

const expenseRouter = express.Router();
const expenseController = require('../controllers/expenseController');
const upload = require('../middleware/imageUpload');

expenseRouter.get('/expense/:siteId',expenseController.getExpensesBySite)
expenseRouter.post('/add-expense',upload.single("billImage"),expenseController.postAddExpense)
// expenseRouter.delete('expense/:id',expenseController.deleteMaterial)
// expenseRouter.get('/expense/:id',expenseController.getMaterialDetails)

module.exports = expenseRouter;