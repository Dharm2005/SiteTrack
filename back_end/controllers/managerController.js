const { validationResult } = require('express-validator');
const Manager = require('../models/Manager')
const fs = require('fs');
const path = require('path');

exports.getManagers = async (req , res , next) => {
   try {
    const manager = await Manager.find({isDeleted : false});
    res.json(manager);
  } catch (err) {
    res.status(500).json({ message: "Error fetching managers", error: err.message });
  }
}

exports.getManagerById = async (req, res, next) => {
  try{
    const {managerId} = req.params;
    const manager = await Manager.findById(managerId)
    res.status(200).json(manager);
  } catch(err) {
    console.error("Error fetching manager:", err);
    res.status(500).json({ err: "Failed to fetch manager" });
  }
}

exports.postAddManager = async ( req, res, next) => {
  try{

    const errors = validationResult(req);
    if(!errors.isEmpty()){

      if(req.file){
        const filePath = path.join(__dirname,"../uploads/managers",req.file.filename)
          if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
          }
      }

      return res.status(400).json({
        message: "Validation faild",
        errors: errors.array().map(err => ({
          field: err.path,
          msg: err.msg
        }))
      })
    }

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
    res.status(201).json({
      message: "manager added successsfully",
      manager : savedManager
    });

  }catch(err){
     res.status(500).json({ message: "Error creating sites", error: err.message });
  }
}

exports.deleteManager = async (req, res, next) => {
  try {
    const managerId = req.params.managerId;
    const updatedManager = await Manager.findByIdAndUpdate(
      managerId,
      {isDeleted : true},
      {new : true}
    )

    if(!updatedManager){
      return res.status(404).json({message : "no manager found"})
    }

    return res.json(updatedManager)

  } catch (error) {
    console.error("Error while deleteing manager" , error);
  }
}

exports.updateManager = async (req , res , next) => {
  try {

    const errors = validationResult(req);
    if(!errors.isEmpty()){

      if(req.file){
        const filePath = path.join(__dirname,"../uploads/managers",req.file.filename)
          if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
          }
      }

      return res.status(400).json({
        message: "Validation faild",
        errors: errors.array().map(err => ({
          field: err.path,
          msg: err.msg
        }))
      })
    }

    const {managerId} = req.params;
    const updates = {...req.body};

    if(req.file){
      const oldManager = await Manager.findById(managerId)

      if(oldManager && oldManager.managerImage){
        const oldPath = path.join(__dirname,"../uploads/managers",oldManager.managerImage)
        if(fs.existsSync(oldPath)){
          fs.unlinkSync(oldPath)
        }
      }

      updates.managerImage = req.file.filename;
    }

    const updatedManager = await Manager.findByIdAndUpdate(
      managerId,
      updates,
      {new : true}
    )

    if(!updatedManager){
      return res.status(404).json({message : "manager not found for update"})
    }

     res.status(201).json({
      message: "manager added successsfully",
      manager : updatedManager
    });

  } catch (error) {
    console.error("Error while updating manager");
  }
}