const Worker = require('../models/Worker');
const Site = require("../models/Site");
const Advance = require('../models/Advance');
const Earn = require('../models/Earn');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');

exports.getWorkersBySite = async (req, res, next) => {
  try {
    const siteId = req.params.siteId;
    const workers = await Worker.find({ site: siteId, isDeleted: false })

    res.status(200).json(workers);
  } catch (err) {
    console.error("Error fetching workers:", err);
    res.status(500).json({ err: "Failed to fetch workers" });
  }
}

exports.getWorkerById = async (req, res, next) => {
  try {
    const { workerId } = req.params;
    const worker = await Worker.findById(workerId);

    return res.status(200).json(worker);
  } catch (error) {
    console.error("Error while fetching worker");
  }
}

exports.postAddWorker = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

      if (req.file) {
        const filePath = path.join(__dirname, "../uploads/workers", req.file.filename);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }

      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.path,
          msg: err.msg
        }))
      })
    }

    let { workerName, workerMobile, site } = req.body;
    const workerImage = req.file ? req.file.filename : null;

    const worker = new Worker({
      workerName,
      workerImage,
      workerMobile,
      site,
    });

    const savedWorker = await worker.save();
    res.status(201).json({ message: "worker added successfully", worker: savedWorker });
  } catch (error) {
    console.error("Error creating worker:", error);
    res.status(500).json({ message: "Error creating worker", error: error.message });
  }
};

exports.deleteWorker = async (req, res, next) => {
  try {
    const { workerId, siteId } = req.params;

    // Step 1: Find the site
    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({ success: false, message: "Site not found" });
    }

    // Step 2: Prevent deletion if site is completed
    if (site.isCompleted) {
      return res.status(400).json({ success: false, message: "Cannot delete worker from a completed site" });
    }

    // Step 3: Soft delete the worker
    const updatedWorker = await Worker.findByIdAndUpdate(
      workerId,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!updatedWorker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    return res.status(200).json({ success: true, data: updatedWorker });

  } catch (error) {
    console.error("Error while deleting worker:", error);
    return res.status(500).json({ success: false, message: "Server error while deleting worker", error: error.message });
  }
};

exports.updateWorker = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        const filePath = path.join(__dirname, "../uploads/workers", req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map(err => ({ field: err.path, msg: err.msg })),
      });
    }

    const { workerId } = req.params;
    const { site } = req.body; // ✅ get siteId from body
    const updates = { ...req.body };

    // Step 1: Check if site is completed
    if (site) {
      const currSite = await Site.findById(site);
      if (!currSite) {
        if (req.file) {
          const filePath = path.join(__dirname, "../uploads/workers", req.file.filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        return res.status(404).json({ success: false, message: "Site not found" });
      }

      if (currSite.isCompleted) {
        if (req.file) {
          const filePath = path.join(__dirname, "../uploads/workers", req.file.filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        return res.status(400).json({ success: false, message: "Cannot update worker of a completed site" });
      }
    }

    // Step 2: Handle worker image update
    if (req.file) {
      const oldWorker = await Worker.findById(workerId);
      if (oldWorker && oldWorker.workerImage) {
        const oldPath = path.join(__dirname, "../uploads/workers", oldWorker.workerImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updates.workerImage = req.file.filename;
    }

    // Step 3: Remove siteId from updates to avoid changing it
    delete updates.site;

    // Step 4: Update worker
    const updatedWorker = await Worker.findByIdAndUpdate(workerId, updates, { new: true });

    if (!updatedWorker) {
      return res.status(404).json({ success: false, message: "No worker found for update" });
    }

    return res.status(200).json({ success: true, message: "Worker updated", worker: updatedWorker });

  } catch (error) {
    console.error("Error updating worker:", error);
    return res.status(500).json({ success: false, message: "Error updating worker", error: error.message });
  }
};

exports.getEarnByWorker = async (req, res, next) => {
  try {
    let workerId = req.params.workerId;
    const earn = await Earn.find({ worker: workerId });

    res.status(200).json(earn)
  } catch (err) {
    console.error("Error fetching eanr:", err);
    res.status(500).json({ err: "Failed to fetch earn" });
  }
}

exports.getAdvancesByWorker = async (req, res, next) => {
  try {
    let workerId = req.params.workerId;
    const advances = await Advance.find({ worker: workerId });

    res.status(200).json(advances)
  } catch (err) {
    console.error("Error fetching advances:", err);
    res.status(500).json({ err: "Failed to fetch advances" });
  }
}


exports.addWorkerAdvance = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.path,
          msg: err.msg,
        })),
      });
    }

    let { worker, amount, date, note } = req.body;

    // Step 1: Check if worker exists
    const workerExists = await Worker.findById(worker);
    if (!workerExists) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    // Step 2: Check if worker's site is completed
    if (workerExists.site) {
      const site = await Site.findById(workerExists.site);
      if (site && site.isCompleted) {
        return res.status(400).json({
          success: false,
          message: "Cannot add advance for worker in a completed site",
        });
      }
    }

    // Step 3: Create advance
    const advance = new Advance({
      worker,
      amount,
      date,
      note,
    });

    const savedAdvance = await advance.save();

    res.status(201).json({
      success: true,
      message: "Advance added successfully",
      advance: savedAdvance,
    });
  } catch (error) {
    console.error("Error adding advance:", error);
    res.status(500).json({ success: false, message: "Error adding advance", error: error.message });
  }
};

exports.updateAdvance = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({ field: err.path, msg: err.msg })),
      });
    }

    const { advanceId, siteId } = req.params; // ✅ siteId from params
    const updates = { ...req.body };

    // Step 1: Check if site is completed
    const site = await Site.findById(siteId);
    if (site && site.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "Cannot update advance for a worker in a completed site",
      });
    }

    // Step 2: Update advance
    const updatedAdvance = await Advance.findByIdAndUpdate(advanceId, updates, { new: true });
    if (!updatedAdvance) {
      return res.status(404).json({ success: false, message: "Advance not found for update" });
    }

    return res.status(200).json({
      success: true,
      message: "Advance updated successfully",
      advance: updatedAdvance,
    });
  } catch (error) {
    console.error("Error updating advance:", error);
    return res.status(500).json({ success: false, message: "Error updating advance", error: error.message });
  }
};

exports.addWorkerEarn = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.path,
          msg: err.msg,
        })),
      });
    }

    let { worker, amount, date, note } = req.body;

    // Step 1: Check if worker exists
    const workerExists = await Worker.findById(worker);
    if (!workerExists) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    // Step 2: Check if worker's site is completed
    if (workerExists.site) {
      const site = await Site.findById(workerExists.site);
      if (site && site.isCompleted) {
        return res.status(400).json({
          success: false,
          message: "Cannot add earning for worker in a completed site",
        });
      }
    }

    // Step 3: Create earning
    const earn = new Earn({
      worker,
      amount,
      date,
      note,
    });

    const savedEarn = await earn.save();

    res.status(201).json({
      success: true,
      message: "Earning added successfully",
      earning: savedEarn,
    });
  } catch (error) {
    console.error("Error adding earning:", error);
    res.status(500).json({ success: false, message: "Error adding earning", error: error.message });
  }
};

exports.updateEarn = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({ field: err.path, msg: err.msg })),
      });
    }

    const { earnId, siteId } = req.params; //  siteId from params
    const updates = { ...req.body };

    // Step 1: Check if site is completed
    const site = await Site.findById(siteId);
    if (site && site.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "Cannot update earning for a worker in a completed site",
      });
    }

    // Step 2: Update earning
    const updatedEarn = await Earn.findByIdAndUpdate(earnId, updates, { new: true });
    if (!updatedEarn) {
      return res.status(404).json({ success: false, message: "Earning not found for update" });
    }

    return res.status(200).json({
      success: true,
      message: "Earning updated successfully",
      earning: updatedEarn,
    });
  } catch (error) {
    console.error("Error updating earning:", error);
    return res.status(500).json({ success: false, message: "Error updating earning", error: error.message });
  }
};

exports.settleWorker = async (req, res, next) => {
  try {
    const { workerId } = req.params;
    const { isSettled } = req.body;

    const settledWorker = await Worker.findByIdAndUpdate(
      workerId,
      { isSettled },
      { new: true }
    )

    if (!settledWorker) {
      return res.status(404).json({ message: "Worker not found for settlement" })
    }
    return res.status(200).json(settledWorker)
  } catch (error) {
    console.log("Error while settling worker", error);
  }
}