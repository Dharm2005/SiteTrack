const express = require('express');

const memoRouter = express.Router()
const memoController = require("../controllers/memoController")

memoRouter.get("/memo/:siteId",memoController.getMemosBySite)
memoRouter.post("/add-memo",memoController.postAddMemo);

module.exports = memoRouter;