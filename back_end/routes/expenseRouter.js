const express = require('express');
const { body, validateResult } = require('express-validator')
const {isAdmin , isManager} = require('../middleware/auth')

const expenseRouter = express.Router();
const expenseController = require('../controllers/expenseController');
const upload = require('../middleware/imageUpload');

expenseRouter.get('/expense/:siteId', expenseController.getExpensesBySite)

expenseRouter.get('/expense/data/:expenseId', expenseController.getExpenseById)

expenseRouter.post('/add-expense',
  isManager,
  upload.single("billImage"),
  [
    body("expenseType")
      .notEmpty().withMessage("Expense type is required"),

    body("totalCost")
      .notEmpty().withMessage("Total cost is required"),

    body("arrivalDate")
      .notEmpty().withMessage("Date of arrival is required")
      .custom((value) => {
        const inputDate = new Date(value).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);

        if (inputDate > today) {
          throw new Error("Arrival date cannot be in the future")
        }
        return true;
      }),

    body("quantity")
      .custom((value, { req }) => {
        if (req.body.expenseType === 'other' || req.body.expenseType === 'vehicleBorrow') {
          return true;
        }
        if (!value) {
          throw new Error("Quantity is required");
        }
        return true;
      }),

    body("unit")
      .custom((value, { req }) => {
        if (req.body.expenseType === 'other' || req.body.expenseType === 'vahicleBorrow') {
          return true;
        }
        if (!value) {
          throw new Error("Unit is required");
        }
        if (req.body.expenseType === "diesel" && value.toLowerCase() !== "litre") {
          throw new Error("Unit must be 'Litre' for diesel expense type");
        }
        return true;
      }),

    body("stoneType")
      .custom((value, { req }) => {
        if (req.body.expenseType === "crushedStone") {
          let parsed;
          try {
            parsed = typeof value === "string" ? JSON.parse(value) : value;
          } catch (e) {
            parsed = [];
          }

          if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
            throw new Error("Stone type is required");
          }
        }
        return true;
      }),


    body("supplierName")
      .custom((value, { req }) => {
        if (req.body.expenseType === 'other' || req.body.expenseType === 'diesel') {
          return true;
        }
        if (!value) {
          throw new Error("Supplier name is required")
        }
        return true;
      })
  ],
  expenseController.postAddExpense)

expenseRouter.get('/expense/:siteId/filter', expenseController.getFilteredExpenses)

expenseRouter.delete('/expense/:expenseId',isManager, expenseController.deleteExpense)

expenseRouter.put('/expense/:expenseId',
  isManager,
  upload.single("billImage"),
  [
    body("expenseType")
      .notEmpty().withMessage("Expense type is required"),

    body("totalCost")
      .notEmpty().withMessage("Total cost is required"),

    body("arrivalDate")
      .notEmpty().withMessage("Date of arrival is required")
      .custom((value) => {
        const inputDate = new Date(value).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);

        if (inputDate > today) {
          throw new Error("Arrival date cannot be in the future")
        }
        return true;
      }),

    body("quantity")
      .custom((value, { req }) => {
        if (req.body.expenseType === 'other' || req.body.expenseType === 'vehicleBorrow') {
          return true;
        }
        if (!value) {
          throw new Error("Quantity is required");
        }
        return true;
      }),

    body("unit")
      .custom((value, { req }) => {
        if (req.body.expenseType === 'other' || req.body.expenseType === 'vahicleBorrow') {
          return true;
        }
        if (!value) {
          throw new Error("Unit is required");
        }
        if (req.body.expenseType === "diesel" && value.toLowerCase() !== "litre") {
          throw new Error("Unit must be 'Litre' for diesel expense type");
        }
        return true;
      }),

    body("stoneType")
      .custom((value, { req }) => {
        if (req.body.expenseType === "crushedStone") {
          let parsed;
          try {
            parsed = typeof value === "string" ? JSON.parse(value) : value;
          } catch (e) {
            parsed = [];
          }

          if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
            throw new Error("Stone type is required");
          }
        }
        return true;
      }),

    body("supplierName")
      .custom((value, { req }) => {
        if (req.body.expenseType === 'other' || req.body.expenseType === 'diesel') {
          return true;
        }
        if (!value) {
          throw new Error("Supplier name is required")
        }
        return true;
      })
  ],
  expenseController.updateExpense)

module.exports = expenseRouter;