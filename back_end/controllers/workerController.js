const Worker = require('../models/Worker');

exports.getWorkersBySite = async (req , res , next) => {
  try{
  const siteId = req.params.siteId;
  const workers = await Worker.find({sites : siteId})

  res.status(200).json(workers);
  } catch(err) {
    console.error("Error fetching workers:", err);
    res.status(500).json({ err: "Failed to fetch workers" });
  }
}

exports.postAddWorker = async (req, res, next) => {
  try {
    let { workerName, workerMobile, sites } = req.body;
    const workerImage = req.file ? req.file.filename : null;

    // Parse sites correctly
    if (typeof sites === "string") {
      try {
        sites = JSON.parse(sites); // convert to array if JSON string
      } catch (err) {
        sites = [sites]; // fallback to single site string
      }
    }

    const worker = new Worker({
      workerName,
      workerImage,
      workerMobile,
      sites: Array.isArray(sites) ? sites : [sites],
    });

    const savedWorker = await worker.save();
    res.status(201).json(savedWorker);
  } catch (error) {
    console.error("Error creating worker:", error);
    res.status(500).json({ message: "Error creating worker", error: error.message });
  }
};
