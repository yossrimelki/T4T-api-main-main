const express = require('express');
const router = express.Router();
const {
  addNewReclamation,
  updateEtat,getAllReclamations
} = require('../controllers/ReclamationController'); // Adjust the path to your controller

// Route to add a new reclamation
router.post('/add', addNewReclamation);

// Route to update the etat (traited or notTraited)
router.put('/update-etat/:reclamationId', updateEtat);

router.get('/', getAllReclamations);


module.exports = router;
