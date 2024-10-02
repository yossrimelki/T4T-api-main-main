// routes/service.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Routes for services
router.get('/', serviceController.getAllServices);
router.get('/categories', serviceController.getUniqueCategories);
router.get('/:id', serviceController.getServiceById);
router.post('/add', serviceController.createService);
router.put('/update/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
