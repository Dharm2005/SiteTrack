const Material = require('../models/Material');

exports.getMaterialsBySite = async (req , res , next) => {
  try{
  const siteId = req.params.siteId;
  const material = await Material.find({sites : siteId})

  res.status(200).json(material);
  } catch(err) {
    console.error("Error fetching materials:", err);
    res.status(500).json({ err: "Failed to fetch materials" });
  }
}

exports.postAddMaterial = async (req, res, next) => {
  try {
    let { materialName, quantity, unit, costPerUnit, totalCost, purchasedDate , sites } = req.body;
    const billImage = req.file ? req.file.filename : null;

    // Parse sites correctly
    if (typeof sites === "string") {
      try {
        sites = JSON.parse(sites); // convert to array if JSON string
      } catch (err) {
        sites = [sites]; // fallback to single site string
      }
    }

    const material = new Material({
      materialName,
      billImage,
      quantity,
      unit,
      costPerUnit,
      totalCost,
      purchasedDate,
      sites: Array.isArray(sites) ? sites : [sites],
    });

    const savedMaterial = await material.save();
    res.status(201).json(savedMaterial);
  } catch (error) {
    console.error("Error adding material:", error);
    res.status(500).json({ message: "Error adding material", error: error.message });
  }
};
