const express = require("express");
const router = express.Router();

const {
  createConversation,
  getMyConversations
} = require("../controllers/conversationController");

const {
  verifyToken
} = require("../middleware/authMiddleware");

router.get(
  "/",
  verifyToken,
  getMyConversations
);

router.post(
  "/:listingId",
  verifyToken,
  createConversation
);

module.exports = router;