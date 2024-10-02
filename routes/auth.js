const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const upload = require('../middleware/upload');
const authenticate = require('../middleware/authenticate'); // Add authentication middleware

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/forget-password', AuthController.forgetpassword);
router.get('/reset-password', AuthController.reset_password);
router.post('/logout', authenticate, AuthController.logout); // Secure the logout route

module.exports = router;
