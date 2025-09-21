const Expense = require('../models/Expense');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');

exports.getExpensesBySite = async (req, res, next) => {
  try {
    const siteId = req.params.siteId;
    const expenses = await Expense.find({ siteId: siteId, isDeleted: false })
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ err: "Failed to fetch expenses" });
  }
};

exports.getExpenseById = async (req, res, next) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);
    return res.status(200).json(expense);
  } catch (error) {
    console.error("Error while fetchig expense by id", error);
    res.status(500).json({ err: "Failed to fetch expense" })
  }
}

exports.getFilteredExpenses = async (req, res, next) => {

  try {
    const { siteId } = req.params;
    const { from, to } = req.query;
    let expenses;
    let query = { siteId: siteId, isDeleted: false };

    if (from && to) {
      query.arrivalDate = {
        $gte: new Date(from),
        $lte: new Date(to)
      }

      expenses = await Expense.find(query)
        .sort({ createdAt: -1 });
    }
    else {
      console.error("There is no filter applyed");
    }
    res.status(200).json(expenses)
  } catch (error) {
    console.log("error while fetching last few expenses");
    res.status(500).json({ err: "Failed to fetch few expenses" });
  }
}

exports.postAddExpense = async (req, res, next) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      if (req.file) {
        const filePath = path.join(__dirname, "../uploads/bills", req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array().map(err => ({
          field: err.path,
          msg: err.msg
        }))
      });
    }

    let { expenseType, quantity, unit, totalCost, arrivalDate, vehicleNumber, supplierName, details, siteId, stoneType } = req.body;
    const billImage = req.file ? req.file.filename : null;

    // Parse sites correctly
    if (stoneType && typeof stoneType === "string") {
      try {
        stoneType = JSON.parse(stoneType); // in case frontend sends JSON string
      } catch (err) {
        stoneType = [stoneType]; // fallback if it's just a single string
      }
    }

    const expense = new Expense({
      expenseType,
      billImage,
      quantity,
      unit,
      totalCost,
      arrivalDate,
      vehicleNumber,
      supplierName,
      details,
      siteId,
      stoneType: Array.isArray(stoneType) ? stoneType : []
    });

    const savedExpense = await expense.save();
    res.status(201).json({
      message : "Expense added successfully",
      expense : savedExpense
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Error adding expense", error: error.message });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      {
        isDeleted: true,
        deletedAt : new Date()
      },
      { new: true }
    )

    if (!updatedExpense) {
      return res.status(404).json({ message: "No expense found" });
    }

    return res.json(updatedExpense);

  } catch (error) {
    console.log("Error while deleting expenses");
  }
}

exports.updateExpense = async (req, res, next) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      if (req.file) {
        const filePath = path.join(__dirname, "../uploads/bills", req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array().map(err => ({
          field: err.path,
          msg: err.msg
        }))
      });
    }

    const { expenseId } = req.params;
    const updates = { ...req.body };

    if (updates.stoneType) {
      try {
        const parsedStoneType = JSON.parse(updates.stoneType);
        updates.stoneType = Array.isArray(parsedStoneType) ? parsedStoneType : [];

      } catch (error) {
        updates.stoneType = [];
      }
    }

    if (req.file) {
      const oldExpanse = await Expense.findById(expenseId);

      if (oldExpanse && oldExpanse.billImage) {
        const oldPath = path.join(__dirname, "../uploads/bills", oldExpanse.billImage)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }

      updates.billImage = req.file.filename
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      updates,
      { new: true }
    )

    if (!updatedExpense) {
      return res.status(404).json({ message: "No expense found for update" })
    }

    return res.json({
      message : "Expense updated successfully",
      expense : updatedExpense
    })
  } catch (error) {
    console.error("Error while updating expense in DB", error);

  }
}