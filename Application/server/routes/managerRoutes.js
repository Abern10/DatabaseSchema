// routes/managerRoutes.js
const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');

// Manager registration and login
router.post('/register', managerController.registerManager);
router.post('/login', managerController.loginManager);

// Car and model management
router.post('/cars', managerController.addCar);
router.post('/models', managerController.addModel);
router.delete('/cars/:brand/:carId', managerController.removeCar);
router.delete('/models/:brand/:carId/:modelId', managerController.removeModel);

// Driver management
router.post('/drivers', managerController.addDriver);
router.delete('/drivers/:name', managerController.removeDriver);

// Statistics and reports
router.get('/top-clients/:k', managerController.getTopClients);
router.get('/car-model-stats', managerController.getCarModelStats);
router.get('/driver-stats', managerController.getDriverStats);
router.get('/cross-city-clients/:city1/:city2', managerController.getCrossCityClients);
router.get('/problematic-local-drivers', managerController.getProblematicLocalDrivers);
router.get('/brand-ratings', managerController.getBrandRatings);

module.exports = router;