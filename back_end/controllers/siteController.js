const Site = require('../models/Site')
const Manager = require('../models/Manager')
const fs = require("fs");
const path = require("path");
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

    const { siteName, location, managerId } = req.body;
    const siteImage = req.file ? req.file.path : null;
    const siteImagePublicId = req.file ? req.file.filename : null;

    const site = new Site({
      siteName,
      location,
      siteImage,
      siteImagePublicId,
      manager: managerId,
      createdBy: req.user.userId
    })

    await site.save();
    await Manager.findByIdAndUpdate(managerId, { $push: { sites: site._id } });

    res.status(201).json({ message: "Site created successfully", site });
  } catch (err) {

    if (req.file) {
      await deleteCloudinaryImage(req.file.filename);
    }

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

    const { siteId } = req.params;

    // Step 1: Find site
    const site = await Site.findById(siteId);
    if (!site) {
      if (req.file) {
        await deleteCloudinaryImage(req.file.filename);
      }
      return res.status(404).json({ success: false, message: "Site not found" });
    }

    if (site.isCompleted) {
      if (req.file) {
        await deleteCloudinaryImage(req.file.filename);
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
    // Step 3: Handle site image update
    if (req.file) {
      updates.siteImage = req.file.path;
      updates.siteImagePublicId = req.file.filename;
    }

    // Step 4: Update site document
    const updatedSite = await Site.findByIdAndUpdate(siteId, updates, { new: true });

    // Delete the old image only after the database update succeeds
    if (
      req.file &&
      site.siteImagePublicId &&
      site.siteImagePublicId !== req.file.filename
    ) {
      await deleteCloudinaryImage(site.siteImagePublicId);
    }
    
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

    if (req.file) {
      await deleteCloudinaryImage(req.file.filename);
    }

    console.error("Error updating site:", error);
    return res.status(500).json({ success: false, message: "Error updating site", error: error.message });
  }
};