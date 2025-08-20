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
    const {siteName, location, siteImage, siteManagerName, siteManagerContact} = req.body;

    const site = new Site({
      siteName,
      location,
      siteImage,
      siteManagerName,
      siteManagerContact
    });

    const savedSite = await site.save()
    res.status(201).json(savedSite)
  } catch (error) {
     res.status(500).json({ message: "Error creating sites", error: err.message });
  }
}