const express = require('express');
const { body, validationResult } = require('express-validator')
const workerRouter = express.Router();
const workerController = require('../controllers/workerController');
const upload = require('../middleware/imageUpload');
const { isManager } = require('../middleware/auth');

workerRouter.get('/worker/:siteId', workerController.getWorkersBySite)
workerRouter.get('/worker/data/:workerId', workerController.getWorkerById)
workerRouter.post('/add-worker',
  isManager,
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
workerRouter.post('/worker/add-advance',
  isManager,
  upload.none(),
  [
    body("amount")
      .notEmpty().withMessage("Amount is required"),

    body("date")
      .notEmpty().withMessage("Date of advance is required")
      .custom((value) => {
        const inputDate = new Date(value).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);

        if (inputDate > today) {
          throw new Error("Date of advance cannot be in the future");
        }
        return true;
      })
  ],
  workerController.addWorkerAdvance)

workerRouter.put('/worker/advance/:advanceId',
  isManager,
  upload.none(),
  [
    body("amount")
      .notEmpty().withMessage("Amount is required"),

    body("date")
      .notEmpty().withMessage("Date of advance is required")
      .custom((value) => {
        const inputDate = new Date(value).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);

        if (inputDate > today) {
          throw new Error("Date of advance cannot be in the future");
        }
        return true;
      })
  ],
  workerController.updateAdvance)

workerRouter.get('/worker/:workerId/earn', workerController.getEarnByWorker)
workerRouter.post('/worker/add-earn',
  isManager,
  upload.none(),
  [
    body("amount")
      .notEmpty().withMessage("Amount is required"),

    body("date")
      .notEmpty().withMessage("Date of advance is required")
      .custom((value) => {
        const inputDate = new Date(value).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);

        if (inputDate > today) {
          throw new Error("Date of advance cannot be in the future");
        }
        return true;
      })
  ],
  workerController.addWorkerEarn)

workerRouter.put('/worker/earn/:earnId',
  isManager,
  upload.none(),
  [
    body("amount")
      .notEmpty().withMessage("Amount is required"),

    body("date")
      .notEmpty().withMessage("Date of advance is required")
      .custom((value) => {
        const inputDate = new Date(value).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);

        if (inputDate > today) {
          throw new Error("Date of advance cannot be in the future");
        }
        return true;
      })
  ],
  workerController.updateEarn)

workerRouter.delete('/worker/:workerId', isManager, workerController.deleteWorker)
workerRouter.put('/worker/:workerId',
  isManager,
  upload.single("workerImage"),
  [
    body("workerName")
      .notEmpty().withMessage("Worker name is required")
      .isLength({ min: 2 }).withMessage("Worker name must be 2 character long"),

    body("workerMobile")
      .notEmpty().withMessage("Mobile number is required"),
  ],
  workerController.updateWorker)

workerRouter.put('/worker/:workerId/settle', isManager, workerController.settleWorker)

module.exports = workerRouter;