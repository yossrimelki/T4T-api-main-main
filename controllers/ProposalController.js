const Proposal = require('../models/Proposal'); // Adjust path to your model

// Function to add a new proposal
const addNewProposal = async (req, res) => {
  try {
    const { to, name, reason, service, text, fromlanguage, tolanguage, status,filepath } = req.body;

    const newProposal = new Proposal({
      to,
      name,
      reason,
      service,
      text,
      fromlanguage,
      tolanguage,
      status,
      filepath
    });

    const savedProposal = await newProposal.save();
    res.status(201).json(savedProposal);
  } catch (error) {
    res.status(500).json({ error: 'Error while creating proposal' });
  }
};

// Function to update the payer status
const updatePayerStatus = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { payer } = req.body;

    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { payer },
      { new: true }
    );

    if (!updatedProposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.status(200).json(updatedProposal);
  } catch (error) {
    res.status(500).json({ error: 'Error while updating payer status' });
  }
};

// Function to update the delivered status
const updateDelivredStatus = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { delivredStatus } = req.body;

    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { delivredStatus },
      { new: true }
    );

    if (!updatedProposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.status(200).json(updatedProposal);
  } catch (error) {
    res.status(500).json({ error: 'Error while updating delivered status' });
  }
};

// Function to get all proposals
const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find(); // Fetch all proposals from the database
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ error: 'Error while fetching proposals' });
  }
};

module.exports = {
  addNewProposal,
  updatePayerStatus,
  updateDelivredStatus,
  getAllProposals
};
