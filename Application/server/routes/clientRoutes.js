// routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Client registration and login
router.post('/register', clientController.registerClient);
router.post('/login', clientController.loginClient);

// Address and credit card management
router.post('/address', clientController.addAddress);
router.post('/credit-card', clientController.addCreditCard);

// Rent management
router.get('/available-models/:date', clientController.getAvailableModels);
router.post('/rent', clientController.bookRent);
router.get('/rents/:clientName', clientController.getClientRents);
router.post('/rent-best-driver', clientController.bookRentBestDriver);

// Reviews
router.post('/review', clientController.addReview);

module.exports = router;