const nodemailer = require('nodemailer');
const Proposal = require('../models/Proposal');
const Reclamation = require('../models/Reclamation');
require('dotenv').config(); // Ensure this is at the top of your file
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAILAPP,
  },
  logger: true, // Enable debug logging
  debug: true,   // Show debug logs
});

// Function to upload files to Cloudinary
const uploadFileToCloudinary = async (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto', filename: fileName },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(fileBuffer);
  });
};

// Upload files endpoint
exports.uploadFilesToCloudinary = async (req, res) => {
  console.log(req.files); // Log incoming files
  
  // Check for files
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files provided for upload' });
  }

  const files = Object.values(req.files); // Get all files if multiple or use specific key if you know it

  const attachments = [];
  try {
    for (const file of files) {
      const uploadResult = await uploadFileToCloudinary(file.data, file.name);
      attachments.push({
        filename: file.name,
        url: uploadResult.secure_url, // Use the secure URL for the email
      });
    }
    return res.status(200).json({ message: 'Files uploaded successfully', attachments });
  } catch (error) {
    return res.status(500).json({ message: 'Error uploading files to Cloudinary', error: error.message });
  }
};

// Send email function
exports.sendEmail = async (req, res) => {
  const { to, name, reason, service, text, fromlanguage, tolanguage, status } = req.body;

  // Initialize attachments array
  const attachments = [];
  console.log(req.files);

  // Check if there are files in the request
  if (req.files) {
    const files = Object.values(req.files); // Convert to array if it's an object
    try {
      for (const file of files) {
        const uploadResult = await uploadFileToCloudinary(file.data, file.name);
        attachments.push({
          filename: file.name,
          url: uploadResult.secure_url,
        });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error uploading files to Cloudinary', error: error.message });
    }
  }

  // Create email content
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Proposal Submission',
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for your proposal. Here are the details of ${status} Status:</p>
      <p><strong>Areas:</strong> ${reason}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>From</strong> ${fromlanguage} Language to <strong>${tolanguage}</strong></p>
      <p><strong>Message:</strong></p>
      <p>${text}</p>
      <p><strong>Attachments:</strong></p>
      <ul>
        ${attachments.map(att => `<li><a href="${att.url}">${att.filename}</a></li>`).join('')}
      </ul>
      <p>Best wishes,</p>
      <p>T4Translations</p>
    `,
  };

  // Add attachments to the mailOptions if any
  if (attachments.length > 0) {
    mailOptions.attachments = attachments.map(att => ({
      filename: att.filename,
      path: att.url, // Use the URL for attachments
    }));
  }

  try {
    const info = await transporter.sendMail(mailOptions);

    // Create new proposal including file URLs
    const newProposal = new Proposal({
      to,
      name,
      reason,
      service,
      text,
      fromlanguage,
      tolanguage,
      status,
      filepath: attachments.map(att => att.url).join(', '), // Store URLs in the proposal
    });

    const savedProposal = await newProposal.save();

    res.status(200).json({ message: 'Email sent and proposal saved', info, savedProposal });
  } catch (error) {
    // Handle email sending errors
    console.error("Error sending email or saving proposal:", error); // Log the error for debugging
    res.status(500).json({ message: 'Error sending email or saving proposal', error: error.message });
  }
};

// Send email function for reclamation
exports.sendReclamation = async (req, res) => {
  const { to, name, reason, text } = req.body;

  console.log("Received data:", { to, name, reason, text }); // Log the received data

  // Check if recipient email is present
  if (!to) {
    return res.status(400).json({ message: 'Recipient email is missing' });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,  // Recipient email address
    subject: 'Reclamation Submission', // Adjust the subject as needed
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for your ${reason}. Here are the details:</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>Message:</strong></p>
      <p>${text}</p>
      <p>Best wishes,</p>
      <p>T4Translations</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    const newReclamation = new Reclamation({
      to,
      name,
      reason,
      text
    });

    const savedReclamation = await newReclamation.save();

    // Return success response with both email info and saved reclamation
    res.status(200).json({ message: 'Email sent and reclamation saved', info, savedReclamation });
  } catch (error) {
    console.error("Error sending email or saving reclamation:", error); // Log the error
    res.status(500).json({ message: 'Error sending email or saving reclamation', error });
  }
};
