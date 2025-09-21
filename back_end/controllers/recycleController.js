const Site = require('../models/Site')

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