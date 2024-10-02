// controllers/areasController.js
const Areas = require('../models/Areas');

// Get all Areas
exports.getAllAreas = async (req, res) => {
    try {
        const areas = await Areas.find();
        res.json(areas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one Area by ID
exports.getAreaById = async (req, res) => {
    try {
        const area = await Areas.findById(req.params.id);
        if (!area) {
            return res.status(404).json({ message: 'Area not found' });
        }
        res.json(area);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new Area
exports.createArea = async (req, res) => {
    const area = new Areas({
        title: req.body.title,
        content: req.body.content,
        color: req.body.color,
        icon: req.body.icon
    });

    try {
        const newArea = await area.save();
        res.status(201).json(newArea);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an Area
exports.updateArea = async (req, res) => {
    try {
        const area = await Areas.findById(req.params.id);
        if (!area) {
            return res.status(404).json({ message: 'Area not found' });
        }

        area.title = req.body.title || area.title;
        area.content = req.body.content || area.content;
        area.color = req.body.color || area.color;
        area.icon = req.body.icon || area.icon;

        const updatedArea = await area.save();
        res.json(updatedArea);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Delete an Area
exports.deleteArea = async (req, res) => {
    try {
        const area = await Areas.findById(req.params.id);
        if (!area) {
            return res.status(404).json({ message: 'Area not found' });
        }

        // Use deleteOne instead of remove
        await Areas.deleteOne({ _id: req.params.id });
        res.json({ message: 'Area deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
