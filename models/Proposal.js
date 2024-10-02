const mongoose = require('mongoose');

// Define the Proposal schema
const proposalSchema = new mongoose.Schema({
  to: { type: String, required: true },
  name: { type: String, required: true },
  reason: { type: String, required: true },
  service: { type: String, required: true },
  text: { type: String, required: true },
  fromlanguage: { type: String, required: true },
  filepath: { type: String, required: false },
  tolanguage: { type: String, required: true },
  status: {
    type: String,
    enum: ['urgent', 'normal', 'anytime'],
    default: 'normal'
  },
  payer: {
    type: Boolean,
    default: false
  },
  delivredStatus: {
    type: String,
    enum: ['Waiting', 'Loading', 'Finished'],
    default: 'Waiting'
  }
});

// Create the Proposal model
const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;
