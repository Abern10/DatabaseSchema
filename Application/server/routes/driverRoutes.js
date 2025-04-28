// routes/driverRoutes.js
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

// Driver login
router.post('/login', driverController.loginDriver);

// Address management
router.put('/address/:name', driverController.updateAddress);

// Car models
router.get('/models', driverController.getAllModels);
router.post('/can-drive', driverController.addCanDriveModel);

module.exports = router;