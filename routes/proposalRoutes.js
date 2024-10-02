const express = require('express');
const router = express.Router();
const {
  addNewProposal,
  updatePayerStatus,
  updateDelivredStatus,getAllProposals
} = require('../controllers/ProposalController'); // Adjust the path to your controller

// Route to add a new proposal
router.post('/add', addNewProposal);

// Route to update payer status (true/false)
router.put('/update-payer/:proposalId', updatePayerStatus);

// Route to update delivered status (Waiting, Loading, Finished)
router.put('/update-delivred-status/:proposalId', updateDelivredStatus);
router.get('/', getAllProposals);

module.exports = router;
