const mongoose = require('mongoose');

// Define the Reclamation schema
const reclamationSchema = new mongoose.Schema({
  to: { type: String, required: true },
  name: { type: String, required: true },
  reason: { type: String, required: true },
  text: { type: String, required: true },
  etat: {
    type: String,
    enum: ['traited', 'notTraited'],
    default: 'notTraited'
  }
});

// Create the Reclamation model
const Reclamation = mongoose.model('Reclamation', reclamationSchema);

module.exports = Reclamation;
