const express = require("express");
const router = express.Router();
const { addSaving, getAllSavings } = require("../controllers/savingController");
const { protect } = require("../middleware/authMiddleware"); 

// These routes match what your frontend is calling
router.post("/add", protect, addSaving);
router.get("/get-all", protect, getAllSavings);

module.exports = router;