const LanguagesT = require('../models/LanguagesT');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility function to handle image upload
const uploadImage = async (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: 'image', public_id: fileName },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        ).end(fileBuffer);
    });
};

// Get all languages
exports.getAllLanguages = async (req, res) => {
    try {
        const languages = await LanguagesT.find();
        res.json(languages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get language by ID
exports.getLanguageById = async (req, res) => {
    try {
        const language = await LanguagesT.findById(req.params.id);
        if (!language) {
            return res.status(404).json({ message: 'Language not found' });
        }
        res.json(language);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new language
exports.createLanguage = async (req, res) => {
    const { icon, title, content } = req.body;

    // Check if image file is provided
    if (!req.files || !req.files.img) {
        return res.status(400).json({ message: 'Image is required.' });
    }

    const file = req.files.img; // Assuming "img" is the key for the uploaded file
    let imageUrl;

    try {
        const uploadResult = await uploadImage(file.data, file.name);
        imageUrl = uploadResult.secure_url; // Get the secure URL from the upload result
    } catch (error) {
        return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
    }

    const language = new LanguagesT({
        icon,
        title,
        img: imageUrl, // Store the image URL
        content,
    });

    try {
        const newLanguage = await language.save();
        res.status(201).json(newLanguage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a language
exports.updateLanguage = async (req, res) => {
    try {
        const language = await LanguagesT.findById(req.params.id);
        if (!language) {
            return res.status(404).json({ message: 'Language not found' });
        }

        // Check for image file and upload if it exists
        if (req.files && req.files.img) {
            const file = req.files.img;

            try {
                const uploadResult = await uploadImage(file.data, file.name);
                language.img = uploadResult.secure_url; // Update the image URL
            } catch (error) {
                return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
            }
        }

        language.icon = req.body.icon || language.icon;
        language.title = req.body.title || language.title;
        language.content = req.body.content || language.content;

        const updatedLanguage = await language.save();
        res.json(updatedLanguage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a language
exports.deleteLanguage = async (req, res) => {
    try {
        const language = await LanguagesT.findById(req.params.id);
        if (!language) {
            return res.status(404).json({ message: 'Language not found' });
        }

        await language.deleteOne({ _id: req.params.id });
        res.json({ message: 'Language deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
