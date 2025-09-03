const express = require('express');

const managerRouter = express.Router();
const managerController = require('../controllers/managerController');
const upload = require('../middleware/imageUpload');

managerRouter.get('/managers',managerController.getManagers)
managerRouter.get('/manager/:managerId',managerController.getManagerById)
managerRouter.post('/add-manager',upload.single("managerImage"),managerController.postAddManager)
managerRouter.delete('/manager/:managerId',managerController.deleteManager)
managerRouter.put('/manager/:managerId',upload.single("managerImage"),managerController.updateManager)

module.exports = managerRouter;