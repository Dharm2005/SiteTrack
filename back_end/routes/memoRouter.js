const express = require('express');

const memoRouter = express.Router()
const memoController = require("../controllers/memoController")
const upload = require('../middleware/imageUpload');

memoRouter.get("/memo/:siteId",memoController.getMemosBySite)
memoRouter.post("/add-memo",upload.none(),memoController.postAddMemo);
memoRouter.delete("/memo/:memoId",memoController.deleteMemo);
memoRouter.put("/memo/:memoId",memoController.completeMemo);

module.exports = memoRouter;