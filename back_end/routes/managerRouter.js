const express = require('express');

const managerRouter = express.Router();
const managerController = require('../controllers/managerController');
const upload = require('../middleware/imageUpload');

managerRouter.get('/manager/',managerController.getManagers)
managerRouter.get('/manager/:siteId',managerController.getManagerBySite)
managerRouter.post('/add-manager',upload.single("managerImage"),managerController.postAddManager)
// managerRouter.delete('/:id',managerController.deleteManager)
// managerRouter.get('/manager/:id',managerController.getManagerDetails)

module.exports = managerRouter;