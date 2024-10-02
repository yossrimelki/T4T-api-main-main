// routes/languagesT.js
const express = require('express');
const router = express.Router();
const languagesTController = require('../controllers/languagesTController');

// Routes for languages
router.get('/', languagesTController.getAllLanguages);
router.get('/:id', languagesTController.getLanguageById);
router.post('/', languagesTController.createLanguage);
router.put('/:id', languagesTController.updateLanguage);
router.delete('/:id', languagesTController.deleteLanguage);

module.exports = router;
