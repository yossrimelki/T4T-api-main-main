    const Service = require('../models/Service');
    const cloudinary = require('cloudinary').v2;
    require('dotenv').config(); // Ensure this is at the top of your file

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

    exports.createService = async (req, res) => {
        const { name, title, excerpt, draft } = req.body;
        const categories = req.body.categories || []; // Default to an empty array if undefined

        console.log(req.files); // Log the uploaded files for debugging

        // Check if image file is provided
        if (!req.files || !req.files.files) {
            return res.status(400).json({ message: 'Image is required.' });
        }

        const file = req.files.files; // Assuming "files" is the key for the uploaded file
        let imageUrl;

        try {
            const uploadResult = await uploadImage(file.data, file.name);
            imageUrl = uploadResult.secure_url; // Get the secure URL from the upload result
        } catch (error) {
            return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
        }

        // Check if categories are provided and handle them
        const categoriesArray = categories.split(',').map(cat => cat.trim());

        const service = new Service({
            name,
            title,
            excerpt,
            image: imageUrl, // Store the image URL
            categories: categoriesArray, // Handle categories as an array
            draft: draft === 'true', // Convert to boolean if needed
        });

        try {
            const newService = await service.save();
            res.status(201).json(newService); // Respond with the newly created service
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Get all services
    exports.getAllServices = async (req, res) => {
        try {
            const services = await Service.find().populate('categories', 'title');
            res.json(services);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Get a service by ID
    exports.getServiceById = async (req, res) => {
        try {
            const service = await Service.findById(req.params.id).populate('categories', 'title');
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }
            res.json(service);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Update a service
    exports.updateService = async (req, res) => {
        try {
            const service = await Service.findById(req.params.id);
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            // Check for image file and upload if it exists
            if (req.files && req.files.files) {
                const file = req.files.files;

                try {
                    const uploadResult = await uploadImage(file.data, file.name);
                    service.image = uploadResult.secure_url; // Update the image URL
                } catch (error) {
                    return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
                }
            }

            service.name = req.body.name || service.name;
            service.title = req.body.title || service.title;
            service.excerpt = req.body.excerpt || service.excerpt;
            service.categories = req.body.categories ? req.body.categories.split(',').map(cat => cat.trim()) : service.categories;
            service.draft = req.body.draft !== undefined ? req.body.draft === 'true' : service.draft;

            const updatedService = await service.save();
            res.json(updatedService);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Delete a service
    exports.deleteService = async (req, res) => {
        try {
            const service = await Service.findById(req.params.id);
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            await service.deleteOne({ _id: req.params.id });
            res.json({ message: 'Service deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Get unique categories
    exports.getUniqueCategories = async (req, res) => {
        try {
            const result = await Service.aggregate([
                { $unwind: "$categories" },
                { $group: { _id: "$categories" } },
                { $sort: { _id: 1 } }
            ]);

            const uniqueCategories = result.map(item => item._id);
            return res.status(200).json({ categories: uniqueCategories });
        } catch (error) {
            console.error("Error getting unique categories:", error);
            return res.status(500).json({
                success: false,
                message: "Error retrieving categories",
                error: error.message
            });
        }
    };
