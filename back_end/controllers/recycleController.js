const Site = require('../models/Site')
const Manager = require('../models/Manager')
const Worker = require('../models/Worker')
const Memo = require('../models/Memo')
const Expense = require('../models/Expense')

const fs = require("fs");
const path = require("path");

exports.getDeletedSites = async (req, res, next) => {
  try {
    let query = { isDeleted: true };

    if (req.user.role === 'admin') {
      query.createdBy = req.user.userId;
    }

    const deletedSites = await Site.find(query);
    res.json(deletedSites)
  } catch (err) {
    res.status(500).json({ message: "Error fetching deleted sites", error: err.message });
  }
}

exports.getDeletedManagers = async (req, res, next) => {
  try {
    let query = { isDeleted: true };

    if (req.user.role === 'admin') {
      query.createdBy = req.user.userId;
    }

    const deletedManagers = await Manager.find(query);
    res.json(deletedManagers)
  } catch (err) {
    res.status(500).json({ message: "Error fetching deleted managers", error: err.message });
  }
}

exports.getDeletedWorkers = async (req, res, next) => {
  try {
    const { siteId } = req.params;

    let query = { isDeleted: true };
    query.site = siteId;

    const deletedWorkers = await Worker.find(query)
    res.json(deletedWorkers)
  } catch (err) {
    res.status(500).json({ message: "Error fetching deleted workers", error: err.message });
  }
}

exports.getDeletedMemos = async (req, res, next) => {
  try {
    const { siteId } = req.params;

    let query = { isDeleted: true };
    query.siteId = siteId;

    const deletedMemos = await Memo.find(query)
    res.json(deletedMemos)
  } catch (err) {
    res.status(500).json({ message: "Error fetching deleted memos", error: err.message });
  }
}

exports.getDeletedExpenses = async (req, res, next) => {
  try {
    const { siteId } = req.params;

    let query = { isDeleted: true };
    query.siteId = siteId;

    const deletedExpenses = await Expense.find(query)
    res.json(deletedExpenses)
  } catch (err) {
    res.status(500).json({ message: "Error fetching deleted expenses", error: err.message });
  }
}

exports.deleteSite = async (req, res, next) => {
  try {
    const { siteId } = req.params;

    const site = await Site.findById(siteId);
    if (!site) return res.status(404).json({ message: "Site not found" });

    if (site && site.siteImage) {
      const Path = path.join(__dirname, "../uploads/sites", site.siteImage)
      if (fs.existsSync(Path)) {
        fs.unlinkSync(Path)
      }
    }

    const deletedSite = await Site.findByIdAndDelete(siteId)
    res.json(deletedSite)

  } catch (err) {
    res.status(500).json({ message: "Error deleting site permanently", error: err.message });
  }
}

exports.restoreSite = async (req, res, next) => {
  try {
    const { siteId } = req.params;

    const restoredSite = await Site.findByIdAndUpdate(
      siteId,
      {
        isDeleted: false,
        deletedAt: null
      },
      { new: true }

    )
    res.json(restoredSite)

  } catch (err) {
    res.status(500).json({ message: "Error restoring deleted site", error: err.message });
  }
}

exports.deleteManager = async (req, res, next) => {
  try {
    const { managerId } = req.params;

    const manager = await Manager.findById(managerId);
    if (!manager) return res.status(404).json({ message: "manager not found" });

    if (manager && manager.managerImage) {
      const Path = path.join(__dirname, "../uploads/managers", manager.managerImage)
      if (fs.existsSync(Path)) {
        fs.unlinkSync(Path)
      }
    }

    const deletedManager = await Manager.findByIdAndDelete(managerId)
    res.json(deletedManager)

  } catch (err) {
    res.status(500).json({ message: "Error deleting manager permanently", error: err.message });
  }
}

exports.restoreManager = async (req, res, next) => {
  try {
    const { managerId } = req.params;

    const restoredManager = await Manager.findByIdAndUpdate(
      managerId,
      {
        isDeleted: false,
        deletedAt: null
      },
      { new: true }

    )
    res.json(restoredManager)

  } catch (err) {
    res.status(500).json({ message: "Error restoring deleted manager", error: err.message });
  }
}

exports.deleteExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (expense && expense.billImage) {
      const Path = path.join(__dirname, "../uploads/bills", expense.billImage)
      if (fs.existsSync(Path)) {
        fs.unlinkSync(Path)
      }
    }

    const deletedExpense = await Expense.findByIdAndDelete(expenseId)
    res.json(deletedExpense)

  } catch (err) {
    res.status(500).json({ message: "Error deleting Expense permanently", error: err.message });
  }
}

exports.restoreExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;

    const restoredExpense = await Expense.findByIdAndUpdate(
      expenseId,
      {
        isDeleted: false,
        deletedAt: null
      },
      { new: true }

    )
    res.json(restoredExpense)

  } catch (err) {
    res.status(500).json({ message: "Error restoring deleted expense", error: err.message });
  }
}

exports.deleteWorker = async (req, res, next) => {
  try {
    const { workerId } = req.params;

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    if (worker && worker.workerImage) {
      const Path = path.join(__dirname, "../uploads/workers", worker.workerImage)
      if (fs.existsSync(Path)) {
        fs.unlinkSync(Path)
      }
    }

    const deletedWorker = await Worker.findByIdAndDelete(workerId)
    res.json(deletedWorker)

  } catch (err) {
    res.status(500).json({ message: "Error deleting Worker permanently", error: err.message });
  }
}

exports.restoreWorker = async (req, res, next) => {
  try {
    const { workerId } = req.params;

    const restoredWorker = await Worker.findByIdAndUpdate(
      workerId,
      {
        isDeleted: false,
        deletedAt: null
      },
      { new: true }

    )
    res.json(restoredWorker)

  } catch (err) {
    res.status(500).json({ message: "Error restoring deleted worker", error: err.message });
  }
}

exports.deleteMemo = async (req, res, next) => {
  try {
    const { memoId } = req.params;

    const deletedMemo = await Memo.findByIdAndDelete(memoId)
    res.json(deletedMemo)

  } catch (err) {
    res.status(500).json({ message: "Error deleting Memo permanently", error: err.message });
  }
}

exports.restoreMemo = async (req, res, next) => {
  try {
    const { memoId } = req.params;

    const restoredMemo = await Memo.findByIdAndUpdate(
      memoId,
      {
        isDeleted: false,
        deletedAt: null
      },
      { new: true }

    )
    res.json(memoId)

  } catch (err) {
    res.status(500).json({ message: "Error restoring deleted memo", error: err.message });
  }
}