const express = require('express');

const materialRouter = express.Router();
const materialController = require('../controllers/materialController');
const upload = require('../middleware/imageUpload');

materialRouter.get('/material/:siteId',materialController.getMaterialsBySite)
materialRouter.post('/add-material',upload.single("billImage"),materialController.postAddMaterial)
// materialRouter.delete('/:id',materialController.deleteMaterial)
// materialRouter.get('/material/:id',materialController.getMaterialDetails)

module.exports = materialRouter;