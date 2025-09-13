const express = require('express');
const { body, validateResult } = require('express-validator')
const memoRouter = express.Router()
const memoController = require("../controllers/memoController")
const upload = require('../middleware/imageUpload');
const { isManager } = require('../middleware/auth');

memoRouter.get("/memo/:siteId", memoController.getMemosBySite)

memoRouter.post("/add-memo",
  isManager,
  upload.none(),
  [
    body("memoType")
      .isIn(["note", "reminder"])
      .withMessage("Type must be either note or reminder"),

    body("text")
    .notEmpty().withMessage("Text is required"),
      
    body("dueDate")
      .custom((value , {req}) => {
        if(req.body.memoType === 'reminder'){
          if(!value){
            throw new Error("Due date is required when type is reminder")
          }
          if(new Date(value) < new Date().setHours(0,0,0,0)){
            throw new Error("Due date cannot be in past")
          }
        }
        return true
      })
  ],
  memoController.postAddMemo);

memoRouter.delete("/memo/:memoId",isManager, memoController.deleteMemo);

memoRouter.put("/memo/:memoId",isManager, memoController.completeMemo);

module.exports = memoRouter;