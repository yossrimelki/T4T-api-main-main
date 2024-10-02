const express = require('express');
const { sendEmail ,sendReclamation,uploadFilesToCloudinary} = require('../controllers/emailController');
const uploadFields = require('../middleware/upload');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Define routes for email sending
router.post('/send', sendEmail);
router.post('/sendr', sendReclamation);
router.post('/upload',uploadFilesToCloudinary);

module.exports = router;
