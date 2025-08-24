const Manager = require('../models/Manager')

exports.getManagers = async (req , res , next) => {
   try {
    const manager = await Manager.find();
    res.json(manager);
  } catch (err) {
    res.status(500).json({ message: "Error fetching managers", error: err.message });
  }
}

exports.getManagerBySite = async (req, res, next) => {
  try{
    const siteId = req.params.siteId;
    const manager = await Manager.findOne({sites : siteId})
    res.status(200).json(manager);
  } catch(err) {
    console.error("Error fetching manager:", err);
    res.status(500).json({ err: "Failed to fetch manager" });
  }
}

exports.postAddManager = async ( req, res, next) => {
  try{
    const {managerName , managerMobile, managerDob, managerGender} = req.body;
    const managerImage = req.file ? req.file.filename : null;

    const manager = new Manager({
      managerName,
      managerImage,
      managerMobile,
      managerDob,
      managerGender,
    });
  
    const savedManager = await manager.save();
    res.status(201).json(savedManager);

  }catch(err){
     res.status(500).json({ message: "Error creating sites", error: err.message });
  }
}