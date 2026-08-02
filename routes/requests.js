const express = require("express");
const router = express.Router();
const { createRequest, getRequests } = require("../controllers/requestController");


// POST  and GET /requests
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createRequest);
router.get("/", getRequests);

module.exports = router;