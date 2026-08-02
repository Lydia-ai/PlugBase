const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  markAsRead,
  editMessage,
  deleteMessage
} = require("../controllers/messageController");

const {
  verifyToken
} = require("../middleware/authMiddleware");

router.post(
  "/:conversationId",
  verifyToken,
  sendMessage
);

router.get(
  "/:conversationId",
  verifyToken,
  getMessages
);

router.patch(
  "/:messageId/read",
  verifyToken,
  markAsRead
);

router.patch(
  "/:messageId",
  verifyToken,
  editMessage
);

router.delete(
  "/:messageId",
  verifyToken,
  deleteMessage
);
module.exports = router;