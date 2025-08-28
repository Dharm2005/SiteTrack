const Memo = require('../models/Memo');

exports.getMemosBySite = async (req , res, next) => {
  try {

    const siteId = req.params.siteId;

    const memos = await Memo.find({siteId : siteId});
    res.status(200).json(memos);
  } catch (error) {
    console.error("Error while fetching memo ",err);
    res.status(500).json({ err: "Failed to get memos" });
  }
}

exports.postAddMemo = async (req , res, next) => {

  try{
    let {memoType, text, dueDate, siteId} = req.body;

    const memo = new Memo({
      memoType,
      text,
      dueDate,
      siteId
    })

    const savedMemo = await memo.save();
    res.status(201).json(savedMemo)

  }catch(err){
    console.error("Error while creating memo ",err);
    res.status(500).json({ err: "Failed to add new memo" });
  }
}