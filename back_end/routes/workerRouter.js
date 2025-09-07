const express = require('express');

const workerRouter = express.Router();
const workerController = require('../controllers/workerController');
const upload = require('../middleware/imageUpload');

workerRouter.get('/worker/:siteId',workerController.getWorkersBySite)
workerRouter.get('/worker/data/:workerId',workerController.getWorkerById)
workerRouter.post('/add-worker',upload.single("workerImage"),workerController.postAddWorker)

workerRouter.get('/worker/:workerId/advance',workerController.getAdvancesByWorker)
workerRouter.post('/worker/add-advance',upload.none(),workerController.addWorkerAdvance)
workerRouter.put('/worker/advance/:advanceId',upload.none(),workerController.updateAdvance)

workerRouter.get('/worker/:workerId/earn',workerController.getEarnByWorker)
workerRouter.post('/worker/add-earn',upload.none(),workerController.addWorkerEarn)
workerRouter.put('/worker/earn/:earnId',upload.none(),workerController.updateEarn)

workerRouter.delete('/worker/:workerId',workerController.deleteWorker)
workerRouter.put('/worker/:workerId',upload.single("workerImage"),workerController.updateWorker)

module.exports = workerRouter;