const express = require('express');

const workerRouter = express.Router();
const workerController = require('../controllers/workerController');
const upload = require('../middleware/imageUpload');

workerRouter.get('/worker/:siteId',workerController.getWorkersBySite)
workerRouter.post('/add-worker',upload.single("workerImage"),workerController.postAddWorker)

workerRouter.post('/worker/add-advance',upload.none(),workerController.addWorkerAdvance)
workerRouter.get('/worker/:workerId/advance',workerController.getAdvancesByWorker)


workerRouter.delete('/worker/:workerId',workerController.deleteWorker)
// workerRouter.get('/worker/:id',workerController.getWorkerDetails)

module.exports = workerRouter;