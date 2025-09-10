const Site = require('../models/Site')
const Manager = require('../models/Manager')
const fs = require("fs");
const path = require("path");
const { validationResult } = require('express-validator');

exports.getSites = async (req, res, next) => {
  try {
    const sites = await Site.find({ isDeleted: false });
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sites", error: err.message });
  }
}

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
      manager: managerId
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

exports.deleteSite = async (req, res, next) => {
  try {
    const siteId = req.params.siteId;
    const updatedSite = await Site.findByIdAndUpdate(
      siteId,
      { isDeleted: true },
      { new: true }
    );

    if (!updatedSite) {
      return res.status(404).json({ message: "No site found" });
    }

    res.json(updatedSite);
  } catch (error) {
    console.log("Error while deleting site", error);
  }
}

exports.updateSite = async (req, res, next) => {
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

    const { siteId } = req.params;
    const updates = { ...req.body };

    if (updates.managerId) {
      updates.manager = updates.managerId;
      delete updates.managerId;
    }

    if (req.file) {
      const oldSite = await Site.findById(siteId)

      if (oldSite && oldSite.siteImage) {
        const oldPath = path.join(__dirname, "../uploads/sites", oldSite.siteImage)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }

      updates.siteImage = req.file.filename;
    }

    const updatedSite = await Site.findByIdAndUpdate(
      siteId,
      updates,
      { new: true }
    )

    if (!updatedSite) {
      return res.status(404).json({ message: "site not found for update" });
    }

    return res.status(200).json({
      message: "Site updated successfully",
      site: updatedSite
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating sites", error: err.message });
  }
}