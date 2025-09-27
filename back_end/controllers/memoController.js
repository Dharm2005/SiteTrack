const Memo = require('../models/Memo');
const Site = require('../models/Site');
const { validationResult } = require('express-validator');

exports.getMemosBySite = async (req , res, next) => {
  try {

    const siteId = req.params.siteId;

    const memos = await Memo.find({siteId : siteId , isDeleted : false});
    res.status(200).json(memos);
  } catch (error) {
    console.error("Error while fetching memo ",err);
    res.status(500).json({ err: "Failed to get memos" });
  }
}

exports.postAddMemo = async (req , res, next) => {
  try{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({
        message : "Validation failed",
        errors : errors.array().map(err => ({
          field : err.path,
          msg: err.msg
        }))
      })
    }

    const {memoType, text, dueDate, siteId} = req.body;

    const site = await Site.findById(siteId);

    if(!site){
      return res.status(404).json({ message: "Site not found" });
    }

    if (site.isCompleted) {
      return res.status(400).json({ message: "Cannot add memo for a completed site" });
    }

    const memo = new Memo({
      memoType,
      text,
      dueDate,
      siteId
    })

    const savedMemo = await memo.save();
    res.status(201).json({
      message : "Memo added successfully",
      memo : savedMemo
    })

  }catch(err){
    console.error("Error while creating memo ",err);
    res.status(500).json({ err: "Failed to add new memo" });
  }
}

exports.deleteMemo = async (req, res, next) => {
  try {
    const { memoId, siteId } = req.params;

    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({ success: false, message: "Site not found" });
    }

    if (site.isCompleted) {
      return res.status(400).json({ success: false, message: "Cannot delete memos for a completed site" });
    }

    const updatedMemo = await Memo.findByIdAndUpdate(
      memoId,
      {
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!updatedMemo) {
      return res.status(404).json({ success: false, message: "Memo not found" });
    }

    return res.json({
      success: true,
      message: "Memo deleted successfully",
      memo: updatedMemo
    });

  } catch (err) {
    console.error("Error while deleting memo", err);
    res.status(500).json({ success: false, message: "Error while deleting memo", error: err.message });
  }
};


exports.completeMemo = async (req, res, next) => {
  try {
    const { memoId, siteId } = req.params;
    const { isCompleted } = req.body;

    // Find the site first
    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({ success: false, message: "Site not found" });
    }

    // Prevent memo completion if site is already completed
    if (site.isCompleted) {
      return res.status(400).json({ success: false, message: "❌ Cannot complete memo because the site is already completed" });
    }

    // Update memo if site is not completed
    const memo = await Memo.findByIdAndUpdate(
      memoId,
      { isCompleted },
      { new: true }
    );

    if (!memo) {
      return res.status(404).json({ success: false, message: "Memo not found" });
    }

    return res.status(200).json({ success: true, data: memo });
  } catch (error) {
    console.error("Error while completing memo:", error);
    return res.status(500).json({ success: false, message: "Server error while completing memo" });
  }
};