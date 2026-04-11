const Saving = require("../models/savings");

exports.addSaving = async (req, res) => {
    try {
        const { amount, date } = req.body;
        const userId = req.user.id; 
        const newSaving = new Saving({ userId, amount, date });
        await newSaving.save();
        res.status(201).json({ message: "Saving added", saving: newSaving });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllSavings = async (req, res) => {
    try {
        const userId = req.user.id;
        const savings = await Saving.find({ userId }).sort({ date: 1 });
        res.status(200).json({ savings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};