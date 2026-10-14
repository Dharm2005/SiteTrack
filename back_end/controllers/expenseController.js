const Expense = require('../models/Expense');
const Site = require('../models/Site');
const path = require('path');   // remove after setting cloudinary
const fs = require('fs');   // remove after setting cloudinary
const { validationResult } = require('express-validator');
const cloudinary = require("../util/cloudinary");


// reusable function to delete image when needed
const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

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
    console.error("error while fetching last few expenses");
    res.status(500).json({ err: "Failed to fetch few expenses" });
  }
}

exports.postAddExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Multer already uploaded the image to Cloudinary.
      // Delete it because validation failed.
      if (req.file) {
        await deleteCloudinaryImage(req.file.filename);
      }

      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array().map(err => ({
          field: err.path,
          msg: err.msg
        }))
      });
    }

    let {
      expenseType,
      quantity,
      unit,
      totalCost,
      arrivalDate,
      vehicleNumber,
      supplierName,
      details,
      siteId,
      stoneType
    } = req.body;

    // Cloudinary image information
    const billImage = req.file ? req.file.path : null;
    const billImagePublicId = req.file ? req.file.filename : null;

    const site = await Site.findById(siteId);

    if (!site) {
      if (billImagePublicId) {
        await deleteCloudinaryImage(billImagePublicId);
      }

      return res.status(404).json({
        message: "Site not found"
      });
    }

    if (site.isCompleted) {
      if (billImagePublicId) {
        await deleteCloudinaryImage(billImagePublicId);
      }

      return res.status(400).json({
        message: "Cannot add expenses to a completed site"
      });
    }

    if (stoneType && typeof stoneType === "string") {
      try {
        stoneType = JSON.parse(stoneType);
      } catch (err) {
        stoneType = [stoneType];
      }
    }

    const expense = new Expense({
      expenseType,
      billImage,
      billImagePublicId,
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

    return res.status(201).json({
      message: "Expense added successfully",
      expense: savedExpense
    });

  } catch (error) {
    // If something fails after Cloudinary upload,
    // remove the uploaded image so we don't leave an orphan.
    if (req.file) {
      await deleteCloudinaryImage(req.file.filename);
    }

    console.error("Error adding expense:", error);

    return res.status(500).json({
      message: "Error adding expense",
      error: error.message
    });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const { siteId, expenseId } = req.params;

    // Check if site exists
    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    // Block deletion if site is completed
    if (site.isCompleted) {
      return res.status(400).json({ message: "Cannot delete expenses for a completed site" });
    }

    // Soft delete the expense
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      {
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "No expense found" });
    }

    return res.json({
      message: "Expense deleted successfully",
      expense: updatedExpense
    });

  } catch (error) {
    console.error("Error while deleting expense:", error);
    res.status(500).json({ message: "Error while deleting expense", error: error.message });
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (req.file) {
        await deleteCloudinaryImage(req.file.filename);
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

    const siteId = req.body.siteId;

    if (!siteId) {
      if (req.file) {
        await deleteCloudinaryImage(req.file.filename);
      }

      return res.status(400).json({
        message: "SiteId is required"
      });
    }

    const site = await Site.findById(siteId);

    if (!site) {
      if (req.file) {
        await deleteCloudinaryImage(req.file.filename);
      }

      return res.status(404).json({
        message: "Site not found"
      });
    }

    if (site.isCompleted) {
      if (req.file) {
        await deleteCloudinaryImage(req.file.filename);
      }

      return res.status(400).json({
        message: "Cannot update expenses for a completed site"
      });
    }

    delete updates.siteId;

    if (updates.stoneType) {
      try {
        const parsedStoneType = JSON.parse(updates.stoneType);

        updates.stoneType = Array.isArray(parsedStoneType)
          ? parsedStoneType
          : [];

      } catch (error) {
        updates.stoneType = [];
      }
    }

    // Find the existing expense
    const oldExpense = await Expense.findById(expenseId);

    if (!oldExpense) {
      if (req.file) {
        await deleteCloudinaryImage(req.file.filename);
      }

      return res.status(404).json({
        message: "No expense found for update"
      });
    }

    // Keep track of old image
    const oldBillImagePublicId = oldExpense.billImagePublicId;

    // If a new image was uploaded
    if (req.file) {
      updates.billImage = req.file.path;
      updates.billImagePublicId = req.file.filename;
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      updates,
      { new: true }
    );

    if (!updatedExpense) {
      if (req.file) {
        await deleteCloudinaryImage(req.file.filename);
      }

      return res.status(404).json({
        message: "No expense found for update"
      });
    }

    // New image successfully saved in DB.
    // Delete the old Cloudinary image.
    if (req.file && oldBillImagePublicId) {
      await deleteCloudinaryImage(oldBillImagePublicId);
    }

    return res.json({
      message: "Expense updated successfully",
      expense: updatedExpense
    });

  } catch (error) {

    // If a new image was uploaded but something failed,
    // remove the new image from Cloudinary.
    if (req.file) {
      await deleteCloudinaryImage(req.file.filename);
    }

    console.error("Error while updating expense in DB", error);

    return res.status(500).json({
      message: "Error updating expense",
      error: error.message
    });
  }
};