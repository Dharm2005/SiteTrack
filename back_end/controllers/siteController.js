const Site = require('../models/Site')
const Manager = require('../models/Manager')
const fs = require("fs");
const path = require("path");
const { validationResult } = require('express-validator');

exports.getSites = async (req, res, next) => {
  try {
    let query = { isDeleted: false };

    if (req.user.role === "admin") {
      query.createdBy = req.user.userId; // sites created by this admin
    }
    else if (req.user.role === "manager") {
      const manager = await Manager.findOne({ userId: req.user.userId })
      query.manager = manager?._id;
    }

    const sites = await Site.find(query);
    res.json(sites);

  } catch (err) {
    res.status(500).json({ message: "Error fetching sites", error: err.message });
  }
};

exports.postAddSite = async (req, res, next) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      if (req.file) {
        const filePath = path.join(__dirname, "../uploads/sites", req.file.filename);
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

    const { siteName, location, managerId } = req.body;
    const siteImage = req.file ? req.file.filename : null;

    const site = new Site({
      siteName,
      location,
      siteImage,
      manager: managerId,
      createdBy: req.user.userId
    })

    await site.save();
    await Manager.findByIdAndUpdate(managerId, { $push: { sites: site._id } });

    res.status(201).json({ message: "Site created successfully", site });
  } catch (err) {
    res.status(500).json({ message: "Error creating sites", error: err.message });
  }
}

exports.getSiteDetails = async (req, res, next) => {
  try {
    const siteId = req.params.siteId;
    const site = await Site.findById(siteId)

    if (!site)
      return res.status(404).json({ error: "Site not found" });
    res.json(site);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
};

exports.markCompleted = async (req, res, next) => {
  try {
    const { siteId } = req.params

    const completedSite = await Site.findByIdAndUpdate(
      siteId,
      { isCompleted: true },
      { new: true }
    )

    res.status(200).json(completedSite);
  } catch (error) {
    console.error("Error while compliting site", error);
  }
}

exports.deleteSite = async (req, res, next) => {
  try {
    const { siteId } = req.params;

    // First, check if site exists
    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({ success: false, message: "No site found" });
    }

    // Block delete if site is already completed
    if (site.isCompleted) {
      return res.status(400).json({ success: false, message: "Cannot delete a completed site" });
    }

    if (site.manager) {
      await Manager.findByIdAndUpdate(site.manager, { $pull: { sites: site._id } });
    }

    // Soft delete (mark as deleted)
    site.isDeleted = true;
    site.deletedAt = new Date();
    await site.save();

    return res.status(200).json({ success: true, data: site });
  } catch (error) {
    console.error("Error while deleting site:", error);
    return res.status(500).json({ success: false, message: "Server error while deleting site" });
  }
};

exports.updateSite = async (req, res, next) => {
  try {
    console.log("reach update backend");
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        const filePath = path.join(__dirname, "../uploads/sites", req.file.filename);
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

    const { siteId } = req.params;

    // Step 1: Find site
    const site = await Site.findById(siteId);
    if (!site) {
      if (req.file) {
        const filePath = path.join(__dirname, "../uploads/sites", req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(404).json({ success: false, message: "Site not found" });
    }

    if (site.isCompleted) {
      if (req.file) {
        const filePath = path.join(__dirname, "../uploads/sites", req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(400).json({ success: false, message: "Cannot update a completed site" });
    }

    const updates = { ...req.body };

    // Store old manager ID before updating
    const oldManagerId = site.manager?.toString();

    // Step 2: Handle manager change
    let newManagerId = null;
    if (updates.managerId) {
      newManagerId = updates.managerId;
      updates.manager = newManagerId;
      delete updates.managerId;
    }

    // tep 3: Handle site image update
    if (req.file) {
      if (site.siteImage) {
        const oldPath = path.join(__dirname, "../uploads/sites", site.siteImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updates.siteImage = req.file.filename;
    }

    // Step 4: Update site document
    const updatedSite = await Site.findByIdAndUpdate(siteId, updates, { new: true });

    console.log("new:" , newManagerId);
    console.log("old:" , oldManagerId);
    
    // Step 5: Sync manager's sites array
    if (newManagerId && newManagerId !== oldManagerId) {
      // Remove siteId from old manager (if existed)
      if (oldManagerId) {
        await Manager.findByIdAndUpdate(oldManagerId, { $pull: { sites: siteId } });
      }

      // Add siteId to new manager
      await Manager.findByIdAndUpdate(newManagerId, { $addToSet: { sites: siteId } });
    }

    return res.status(200).json({
      success: true,
      message: "Site updated successfully",
      site: updatedSite
    });

  } catch (error) {
    console.error("Error updating site:", error);
    return res.status(500).json({ success: false, message: "Error updating site", error: error.message });
  }
};