// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    categories: [{
        type: String, // Store category names as strings
        required: true
    }],
    draft: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Service', serviceSchema);
