const Site = require('../models/Site')
const Manager = require('../models/Manager')
const Worker = require('../models/Worker')
const Memo = require('../models/Memo')
const Expense = require('../models/Expense')

exports.getDeletedSites = async (req, res, next) => {
  try{
    let query = {isDeleted : true};

    if(req.user.role === 'admin'){
      query.createdBy = req.user.userId;
    }

    const deletedSites = await Site.find(query);
    res.json(deletedSites)
  } catch(err){
    res.status(500).json({ message: "Error fetching deleted sites", error: err.message });
  }
}

exports.getDeletedManagers = async (req, res, next) => {
  try{
    let query = {isDeleted : true};

    if(req.user.role === 'admin'){
      query.createdBy = req.user.userId;
    }

    const deletedManagers = await Manager.find(query);
    res.json(deletedManagers)
  } catch(err){
    res.status(500).json({ message: "Error fetching deleted managers", error: err.message });
  }
}

exports.getDeletedWorkers = async (req, res, next) => {
  try {
    const {siteId} = req.params;

    let query = {isDeleted : true};
    query.site = siteId;

    const deletedWorkers = await Worker.find(query)
    res.json(deletedWorkers)
  } catch (err) {
    res.status(500).json({ message: "Error fetching deleted workers", error: err.message });
  }
}

exports.getDeletedMemos = async (req, res, next) => {
  try {
    const {siteId} = req.params;

    let query = {isDeleted : true};
    query.siteId = siteId;

    const deletedMemos = await Memo.find(query)
    res.json(deletedMemos)
  } catch (err) {
    res.status(500).json({ message: "Error fetching deleted memos", error: err.message });
  }
}

exports.getDeletedExpenses = async (req, res, next) => {
  try {
    const {siteId} = req.params;

    let query = {isDeleted : true};
    query.siteId = siteId;

    const deletedExpenses = await Expense.find(query)
    res.json(deletedExpenses)
  } catch (err) {
    res.status(500).json({ message: "Error fetching deleted expenses", error: err.message });
  }
}

exports.deleteSite = async (req, res, next) => {
  try {
    const {siteId} = req.params;

    const deletedSite = await Site.findByIdAndDelete(siteId)
    res.json(deletedSite)
    
  } catch (err) {
    res.status(500).json({ message: "Error deleting site permanently", error: err.message });
  }
}

exports.restoreSite = async (req, res, next) => {
  try {
    const {siteId} = req.params;

    const restoredSite = await Site.findByIdAndUpdate(
      siteId,
      {
        isDeleted : false,
        deletedAt : null
      },
      {new : true}

    )
    res.json(restoredSite)
    
  } catch (err) {
    res.status(500).json({ message: "Error restoring deleted site", error: err.message });
  }
}

exports.deleteManager = async (req, res, next) => {
  try {
    const {managerId} = req.params;

    const deletedManager = await Manager.findByIdAndDelete(managerId)
    res.json(deletedManager)
    
  } catch (err) {
    res.status(500).json({ message: "Error deleting manager permanently", error: err.message });
  }
}

exports.restoreManager = async (req, res, next) => {
  try {
    const {managerId} = req.params;

    const restoredManager = await Manager.findByIdAndUpdate(
      managerId,
      {
        isDeleted : false,
        deletedAt : null
      },
      {new : true}

    )
    res.json(restoredManager)
    
  } catch (err) {
    res.status(500).json({ message: "Error restoring deleted manager", error: err.message });
  }
}