// models/LanguagesT.js
const mongoose = require('mongoose');

const languagesTSchema = new mongoose.Schema({
    icon: {
        type: String,
        required: true // Expects the name of the icon (from Feather Icons)
    },
    title: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true // Path to the image
    },
    content: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('LanguagesT', languagesTSchema);
