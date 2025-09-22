const Site = require('../models/Site')
const Manager = require('../models/Manager')
const Worker = require('../models/Worker')

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
  } catch (error) {
    res.status(500).json({ message: "Error fetching deleted workers", error: err.message });
  }
}