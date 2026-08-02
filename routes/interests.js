const express = require("express");
const router = express.Router();

const { createInterest } = require("../controllers/interestController");
const { verifyToken } = require("../middleware/authMiddleware");

// POST /interests
router.post("/", verifyToken, createInterest);

module.exports = router;