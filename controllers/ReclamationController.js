const Reclamation = require('../models/Reclamation'); // Adjust path to your model

// Function to add a new reclamation
const addNewReclamation = async (req, res) => {
  try {
    const { to, name, reason, text } = req.body;

    const newReclamation = new Reclamation({
      to,
      name,
      reason,
      text

    });

    const savedReclamation = await newReclamation.save();
    res.status(201).json(savedReclamation);
  } catch (error) {
    res.status(500).json({ error: 'Error while creating reclamation' });
  }
};

// Function to update the etat (traited/notTraited)
const updateEtat = async (req, res) => {
  try {
    const { reclamationId } = req.params;
    const { etat } = req.body;

    const updatedReclamation = await Reclamation.findByIdAndUpdate(
      reclamationId,
      { etat },
      { new: true }
    );

    if (!updatedReclamation) {
      return res.status(404).json({ message: 'Reclamation not found' });
    }

    res.status(200).json(updatedReclamation);
  } catch (error) {
    res.status(500).json({ error: 'Error while updating etat' });
  }
};
const getAllReclamations = async (req, res) => {
    try {
      const reclamations = await Reclamation.find(); // Fetch all reclamations
      res.status(200).json(reclamations);
    } catch (error) {
      res.status(500).json({ error: 'Error while fetching reclamations' });
    }
  };
  

module.exports = {
  addNewReclamation,
  updateEtat,getAllReclamations
};
