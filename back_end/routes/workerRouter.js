const express = require('express');

const workerRouter = express.Router();
const workerController = require('../controllers/workerController');
const upload = require('../middleware/imageUpload');

workerRouter.get('/worker/:siteId',workerController.getWorkersBySite)
workerRouter.get('/worker/data/:workerId',workerController.getWorkerById)
workerRouter.post('/add-worker',upload.single("workerImage"),workerController.postAddWorker)

workerRouter.get('/worker/:workerId/advance',workerController.getAdvancesByWorker)
workerRouter.post('/worker/add-advance',upload.none(),workerController.addWorkerAdvance)

workerRouter.delete('/worker/:workerId',workerController.deleteWorker)
workerRouter.put('/worker/:workerId',upload.single("workerImage"),workerController.updateWorker)


module.exports = workerRouter;