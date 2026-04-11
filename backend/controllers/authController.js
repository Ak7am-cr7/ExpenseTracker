const User = require("../models/User");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Helper for JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// 1. Register User
const registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        
        // FIX: Check if a file was uploaded, otherwise use the body or empty string
        let profileImageUrl = "";
        if (req.file) {
            profileImageUrl = `https://expensetracker-3r4e.onrender.com/uploads/${req.file.filename}`;
        } else if (req.body.profileImageUrl) {
            profileImageUrl = req.body.profileImageUrl;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User exists" });

        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl
        });

        res.status(201).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageUrl: user.profileImageUrl
            },
            token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        res.status(200).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageUrl: user.profileImageUrl
            },
            token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Get User Info
const getUserInfo = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. Delete Profile Image
const deleteProfileImage = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.profileImageUrl = "";
        await user.save();

        return res.status(200).json({ message: "Deleted successfully", user });

    } catch (err) {
        console.error("REAL ERROR:", err);
        return res.status(500).json({
            message: "Server error during deletion",
            error: err.message
        });
    }
};

// 5. Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        let profileImageUrl = req.body.profileImageUrl;

        // FIX: If a new file is uploaded via Multer, create a secure HTTPS link
        if (req.file) {
            profileImageUrl = `https://expensetracker-3r4e.onrender.com/uploads/${req.file.filename}`;
        }

        const userId = req.user.id || req.user._id;
        const user = await User.findByIdAndUpdate(
            userId, 
            { profileImageUrl }, 
            { new: true }
        ).select("-password");
        
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 6. Update User Budget
const updateBudget = async (req, res) => {
  try {
    const { monthlyLimit } = req.body; 
    const userId = req.user ? (req.user.id || req.user._id) : null; 

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: No user found in request" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { monthlyBudget: Number(monthlyLimit) }, 
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Budget updated",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    deleteProfileImage,
    updateUserProfile,
    updateBudget,
};