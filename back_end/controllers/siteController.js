const Site = require('../models/Site')
const Manager = require('../models/Manager')

exports.getSites = async (req , res , next) => {
   try {
    const sites = await Site.find();
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sites", error: err.message });
  }
}

exports.postAddSite = async (req , res , next) => {
  try {
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
  }catch (err) {
     res.status(500).json({ message: "Error creating sites", error: err.message });
  }
}

exports.getSiteDetails = async (req ,res, next) => {
  try{
    const siteId = req.params.id;
     const site = await Site.findById(siteId)
     
    if (!site) 
      return res.status(404).json({ error: "Site not found" });
    res.json(site);
  }catch(err){
    res.status(500).json({error : err.message})
  }
};