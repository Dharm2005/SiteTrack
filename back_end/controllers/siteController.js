const Site = require('../models/Site')

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
    const {siteName, location, siteManagerName, siteManagerContact} = req.body;
    const siteImage = req.file ? req.file.filename : null;

    const site = new Site({
      siteName,
      location,
      siteImage,
      siteManagerName,
      siteManagerContact
    });

    const savedSite = await site.save()
    res.status(201).json(savedSite)
  } catch (err) {
     res.status(500).json({ message: "Error creating sites", error: err.message });
  }
}

exports.getSiteDetails = async (req ,res, next) => {
  try{
    const siteId = req.params.id;
    const site = await Site.findById(siteId);
    if (!site) 
      return res.status(404).json({ error: "Site not found" });
    res.json(site);
  }catch(err){
    res.status(500).json({error : err.message})
  }
};