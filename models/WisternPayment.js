const mongoose = require('mongoose');

// Define the WisternPayment schema
const wisternPaymentSchema = new mongoose.Schema({
  linkingProposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
  prix: { type: Number, required: true },
  codeWistern: { type: String, default: null },
  status: {
    type: String,
    enum: ['not paid', 'paid', 'check'],
    default: 'not paid'
  }
});

// Create the WisternPayment model
const WisternPayment = mongoose.model('WisternPayment', wisternPaymentSchema);

module.exports = WisternPayment;
