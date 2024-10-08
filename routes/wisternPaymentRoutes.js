const express = require('express');
const { 
    newWisternPayment, 
    updateWisternCode, 
    findWisternPaymentById, 
    findAllWisternPayments ,
    findWisternPaymentsByProposal
} = require('../controllers/wisternPaymentController');
const router = express.Router();

// Route to create a new WisternPayment
router.post('/', newWisternPayment);

// Route to update WisternCode and status
router.put('/confirm/:paymentId', updateWisternCode);

// Route to find a WisternPayment by ID
router.get('/:paymentId', findWisternPaymentById);

// Route to find all WisternPayments
router.get('/', findAllWisternPayments);
router.get('/proposal/:linkingProposal', findWisternPaymentsByProposal); // New route

module.exports = router;
