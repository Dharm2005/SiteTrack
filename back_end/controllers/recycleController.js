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

    // Find the site first
    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    // ✅ Delete site image from uploads folder
    if (site.siteImage) {
      const filePath = path.join(__dirname, "../uploads/sites", site.siteImage);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // ✅ Permanently delete site from DB
    const deletedSite = await Site.findByIdAndDelete(siteId);

    return res.json({
      success: true,
      message: "Site permanently deleted",
      data: deletedSite
    });

  } catch (err) {
    console.error("Error deleting site permanently:", err);
    return res.status(500).json({
      success: false,
      message: "Error deleting site permanently",
      error: err.message
    });
  }
};

exports.restoreSite = async (req, res, next) => {
  try {
    const { siteId } = req.params;

    // Restore the site
    const restoredSite = await Site.findByIdAndUpdate(
      siteId,
      {
        isDeleted: false,
        deletedAt: null
      },
      { new: true }
    );

    if (!restoredSite) {
      return res.status(404).json({ message: "Site not found" });
    }

    let restoredManagerMessage = null;

    // Re-assign site back to manager if it has a manager
    if (restoredSite.manager) {
      const manager = await Manager.findById(restoredSite.manager);

      if (manager) {
        // If manager was soft-deleted, restore it
        if (manager.isDeleted) {
          manager.isDeleted = false;
          manager.deletedAt = null;
          await manager.save();
          restoredManagerMessage = `Manager "${manager.managerName}" was also restored.`;
        }

        // Ensure site is in manager's sites array
        await Manager.findByIdAndUpdate(
          restoredSite.manager,
          { $addToSet: { sites: restoredSite._id } }
        );
      }
    }

    res.json({
      success: true,
      site: restoredSite,
      message: restoredManagerMessage
    });

  } catch (err) {
    res.status(500).json({ 
      message: "Error restoring deleted site", 
      error: err.message 
    });
  }
};


exports.deleteManager = async (req, res, next) => {
  try {
    const { managerId } = req.params;

    // First check if manager exists
    const manager = await Manager.findById(managerId);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Check if any site (active or soft deleted) is still assigned to this manager
    const assignedSites = await Site.find({ manager: managerId });
    if (assignedSites.length > 0) {
      return res.status(400).json({
        message: "Cannot delete manager. They are still assigned to one or more sites.",
        sites: assignedSites.map(site => ({ id: site._id, name: site.siteName }))
      });
    }

    // Delete manager image if exists
    if (manager.managerImage) {
      const Path = path.join(__dirname, "../uploads/managers", manager.managerImage);
      if (fs.existsSync(Path)) {
        fs.unlinkSync(Path);
      }
    }

    // Permanently delete manager
    const deletedManager = await Manager.findByIdAndDelete(managerId);
    return res.json({ success: true, data: deletedManager });

  } catch (err) {
    console.error("Error deleting manager permanently:", err);
    return res.status(500).json({ 
      message: "Error deleting manager permanently", 
      error: err.message 
    });
  }
};

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