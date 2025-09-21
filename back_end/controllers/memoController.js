const { validationResult } = require('express-validator');
const Memo = require('../models/Memo');

exports.getMemosBySite = async (req , res, next) => {
  try {

    const siteId = req.params.siteId;

    const memos = await Memo.find({siteId : siteId , isDeleted : false});
    res.status(200).json(memos);
  } catch (error) {
    console.error("Error while fetching memo ",err);
    res.status(500).json({ err: "Failed to get memos" });
  }
}

exports.postAddMemo = async (req , res, next) => {
  try{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({
        message : "Validation failed",
        errors : errors.array().map(err => ({
          field : err.path,
          msg: err.msg
        }))
      })
    }

    const {memoType, text, dueDate, siteId} = req.body;

    const memo = new Memo({
      memoType,
      text,
      dueDate,
      siteId
    })

    const savedMemo = await memo.save();
    res.status(201).json({
      message : "Memo added successfully",
      memo : savedMemo
    })

  }catch(err){
    console.error("Error while creating memo ",err);
    res.status(500).json({ err: "Failed to add new memo" });
  }
}

exports.deleteMemo = async (req , res , next) => {
  try{
    const {memoId} = req.params;

    const updatedMemo = await Memo.findByIdAndUpdate(
      memoId,
      {
        isDeleted: true,
        deletedAt : new Date()
      },
      {new: true}
    )

    if(!updatedMemo){
      return res.status(400).res({message : "Error to update memo"})
    }

    return res.json(updatedMemo)

  }catch(err){
    console.error("Error while deleting memo",err);
  }
}

exports.completeMemo = async (req, res, next) => {
  try {
    const {memoId} = req.params;
    const {isCompleted} = req.body;

    const completedMemo = await Memo.findByIdAndUpdate(
      memoId,
      {isCompleted},
      {new : true}
    )

    if(!completedMemo){
      return res.status(404).json({message : "memo not found to complete"})
    }
    return res.status(200).json(completedMemo)
  } catch (error) {
    console.error("Error while completing memo" , error);
  }
}