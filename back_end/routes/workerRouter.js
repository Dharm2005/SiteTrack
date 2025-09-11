const express = require('express');
const {body , validationResult} = require('express-validator')
const workerRouter = express.Router();
const workerController = require('../controllers/workerController');
const upload = require('../middleware/imageUpload');

workerRouter.get('/worker/:siteId', workerController.getWorkersBySite)
workerRouter.get('/worker/data/:workerId', workerController.getWorkerById)
workerRouter.post('/add-worker',
  upload.single("workerImage"),
  [
    body("workerName")
      .notEmpty().withMessage("Worker name is required")
      .isLength({ min: 2 }).withMessage("Worker name must be 2 character long"),

    body("workerMobile")
      .notEmpty().withMessage("Mobile number is required"),
  ],
  workerController.postAddWorker)

workerRouter.get('/worker/:workerId/advance', workerController.getAdvancesByWorker)
workerRouter.post('/worker/add-advance', upload.none(), workerController.addWorkerAdvance)
workerRouter.put('/worker/advance/:advanceId', upload.none(), workerController.updateAdvance)

workerRouter.get('/worker/:workerId/earn', workerController.getEarnByWorker)
workerRouter.post('/worker/add-earn', upload.none(), workerController.addWorkerEarn)
workerRouter.put('/worker/earn/:earnId', upload.none(), workerController.updateEarn)

workerRouter.delete('/worker/:workerId', workerController.deleteWorker)
workerRouter.put('/worker/:workerId', 
  upload.single("workerImage"), 
  [
    body("workerName")
      .notEmpty().withMessage("Worker name is required")
      .isLength({ min: 2 }).withMessage("Worker name must be 2 character long"),

    body("workerMobile")
      .notEmpty().withMessage("Mobile number is required"),
  ],
  workerController.updateWorker)

workerRouter.put('/worker/:workerId/settle', workerController.settleWorker)

module.exports = workerRouter;