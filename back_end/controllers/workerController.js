const Worker = require('../models/Worker');
const Advance = require('../models/Advance');
const Earn = require('../models/Earn');
const path = require('path');
const fs = require('fs');

exports.getWorkersBySite = async (req , res , next) => {
  try{
    const siteId = req.params.siteId;
    const workers = await Worker.find({site : siteId , isDeleted : false})

    res.status(200).json(workers);
  } catch(err) {
    console.error("Error fetching workers:", err);
    res.status(500).json({ err: "Failed to fetch workers" });
  }
}

exports.getWorkerById = async (req, res, next) => {
  try {
    const {workerId} = req.params;
    const worker = await Worker.findById(workerId);

    return res.status(200).json(worker);
  } catch (error) {
    console.error("Error while fetching worker");
  }
}

exports.postAddWorker = async (req, res, next) => {
  try {
    let { workerName, workerMobile, site } = req.body;
    const workerImage = req.file ? req.file.filename : null;

    const worker = new Worker({
      workerName,
      workerImage,
      workerMobile,
      site,
    });

    const savedWorker = await worker.save();
    res.status(201).json(savedWorker);
  } catch (error) {
    console.error("Error creating worker:", error);
    res.status(500).json({ message: "Error creating worker", error: error.message });
  }
};

exports.deleteWorker = async (req, res, next) => {
  try {
    const {workerId} = req.params;

    const updatedWorker = await Worker.findByIdAndUpdate(
      workerId,
      {isDeleted : true},
      {new : true}
    )

    if(!updatedWorker){
      return res.status(404).json({message : "no worker found"})
    }
  
    return res.json(updatedWorker)

  } catch (error) {
    
  }
}

exports.updateWorker = async (req, res, next) => {
  try {
    const {workerId} = req.params;
    const updates = {...req.body};

    if(req.file){
      const oldWorker = await Worker.findById(workerId);

      if(oldWorker && oldWorker.workerImage){
        const oldPath = path.join(__dirname,"../uploads/workers",oldWorker.workerImage)
        if(fs.existsSync(oldPath)){
          fs.unlinkSync(oldPath)
        }
      }
      updates.workerImage = req.file.filename;
    }

    const updatedWorker = await Worker.findByIdAndUpdate(
      workerId,
      updates,
      {new: true}
    )

    if(!updatedWorker){
      return res.status(400).json({message : "No worker found for update"})
    }

    return res.json(updatedWorker);

  } catch (error) {
    console.error("Error while editing worker in backend" , error);
  }
}


exports.getAdvancesByWorker = async (req, res, next) => {
  try{
    let workerId = req.params.workerId;
    const advances = await Advance.find({worker : workerId});

    res.status(200).json(advances)
  }catch(err) {
    console.error("Error fetching advances:", err);
    res.status(500).json({ err: "Failed to fetch advances" });
  }
}

exports.addWorkerAdvance = async (req, res, next) => {
  try{
    let {worker, amount, date, note} = req.body;

    const workerExists = await Worker.findById(worker);
    if (!workerExists) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const advance = new Advance({
      worker,
      amount,
      date,
      note
    })

    const savedAdvance = await advance.save();
    res.status(201).json(savedAdvance)
  }catch(error) {
    console.error("Error Adding advance:", error);
    res.status(500).json({ message: "Error Adding advance", error: error.message });
  }
}

exports.updateAdvance = async (req, res, next) => {
  try {
    const {advanceId} = req.params;
    const updates = {...req.body};

    const updatedAdvance = await Advance.findByIdAndUpdate(
      advanceId,
      updates,
      {new : true}
    )
    
    if(!updatedAdvance){
      return res.status(404).json({message : "Advance not found for update"})
    }
    return res.status(200).json(updatedAdvance);

  } catch (error) {
    console.error("Error while editing advance in DB" ,error);
  }
}


exports.getEarnByWorker = async (req, res, next) => {
  try{
    let workerId = req.params.workerId;
    const earn = await Earn.find({worker : workerId});

    res.status(200).json(earn)
  }catch(err) {
    console.error("Error fetching eanr:", err);
    res.status(500).json({ err: "Failed to fetch earn" });
  }
}

exports.addWorkerEarn = async (req, res, next) => {
  try{
    let {worker, amount, date, note} = req.body;

    const workerExists = await Worker.findById(worker);
    if (!workerExists) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const earn = new Earn({
      worker,
      amount,
      date,
      note
    })

    const savedEarn = await earn.save();
    res.status(201).json(savedEarn)
  }catch(error) {
    console.error("Error Adding earn:", error);
    res.status(500).json({ message: "Error Adding earn", error: error.message });
  }
}

exports.updateEarn = async (req, res, next) => {
  try {
    const {earnId} = req.params;
    const updates = {...req.body};

    const updatedEarn = await Earn.findByIdAndUpdate(
      earnId,
      updates,
      {new : true}
    )
    
    if(!updatedEarn){
      return res.status(404).json({message : "Earn not found for update"})
    }
    return res.status(200).json(updatedEarn);

  } catch (error) {
    console.error("Error while editing Earn in DB" ,error);
  }
}

exports.settleWorker = async (req, res, next) => {
  try {
    const {workerId} = req.params;
    const {isSettled} = req.body;

    const settledWorker = await Worker.findByIdAndUpdate(
      workerId,
      {isSettled},
      {new : true}
    )

    if(!settledWorker){
      return res.status(404).json({message : "Worker not found for settlement"})
    }
    return res.status(200).json(settledWorker)
  } catch (error) {
    console.log("Error while settling worker" , error);
  }
}