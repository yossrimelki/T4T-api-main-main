const WisternPayment = require('../models/WisternPayment');
const Proposal = require('../models/Proposal');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAILAPP,
    },
    logger: true,
    debug: true,
});

// Function to create a new WisternPayment
const newWisternPayment = async (req, res) => {
    try {
        const { linkingProposal, prix } = req.body;

        // Create a new WisternPayment
        const wisternPayment = new WisternPayment({
            linkingProposal,
            prix,
        });

        const savedPayment = await wisternPayment.save();

        // Fetch the proposal to send email
        const proposal = await Proposal.findById(linkingProposal);
        console.log(proposal);
        if (proposal) {
            // Send email to proposal.to
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: proposal.to,
                subject: 'Payment Confirmation Needed',
                html: `
                    <p>Dear User,</p>
                    <p>You need to <strong> pay ${prix} $ </storng> to confirm your proposal.</p>
                    <p>Please confirm your payment by using the following link: <a href="${process.env.WISTERN_CODE_UPDATE_URL}/${savedPayment._id}">Confirm Payment</a></p>
                    <p>Best wishes,</p>
                    <p>T4Translations</p>
                `,
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(201).json(savedPayment);
    } catch (error) {
        res.status(500).json({ error: 'Error while creating WisternPayment' });
    }
};

// Function to update WisternCode and status
const updateWisternCode = async (req, res) => {
    console.log("Received request to update Wistern code for:", req.params.paymentId);
    try {
        const { paymentId } = req.params;
        const { codeWistern } = req.body;

        const updatedPayment = await WisternPayment.findByIdAndUpdate(
            paymentId,
            { codeWistern, status: 'check' },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: 'WisternPayment not found' });
        }

        // Notify admin about the payment confirmation
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'Payment Confirmation',
            html: `
                <p>A payment has been confirmed. Please check the details:</p>
                <p>Payment ID: ${updatedPayment._id}</p>
                <p>Code: ${codeWistern}</p>
                <p>Status: ${updatedPayment.status}</p>
                <p>Best wishes,</p>
                <p>T4Translations</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(500).json({ error: 'Error while updating WisternPayment' });
    }
};

// Function to find a WisternPayment by ID
const findWisternPaymentById = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await WisternPayment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'WisternPayment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Error while retrieving WisternPayment' });
    }
};

// Function to find all WisternPayments
const findAllWisternPayments = async (req, res) => {
    try {
        const payments = await WisternPayment.find();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Error while retrieving WisternPayments' });
    }
};
const findWisternPaymentsByProposal = async (req, res) => {
    try {
        const { linkingProposal } = req.params;

        const payments = await WisternPayment.find({ linkingProposal });
        if (!payments.length) {
            return res.status(404).json({ message: 'No WisternPayments found for this proposal' });
        }

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Error while retrieving WisternPayments by linkingProposal' });
    }
};

module.exports = {
    newWisternPayment,
    updateWisternCode,
    findWisternPaymentById,
    findAllWisternPayments,
    findWisternPaymentsByProposal,
};
