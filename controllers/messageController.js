const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Notification = require("../models/Notification");
const User = require("../models/User");

exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Message cannot be empty."
      });
    }

    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({
        error: "Conversation not found."
      });
    }

    // Only participants can send messages
    if (
  conversation.buyer.toString() !== req.user.id &&
  conversation.seller.toString() !== req.user.id
) {
      return res.status(403).json({
        error: "Unauthorized."
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      text
    });

    conversation.lastMessage = text;

conversation.lastMessageAt = message.createdAt;

await conversation.save();


const sender = await User.findById(req.user.id);

const receiver =
  conversation.buyer.toString() === req.user.id
    ? conversation.seller
    : conversation.buyer;

await Notification.create({
  user: receiver,
  message: `${sender.name} sent you a message.`,
  type: "message",
  referenceId: conversation._id
});

    const io = req.app.get("io");

const populatedMessage = await Message.findById(message._id)
  .populate("sender", "name");

io.to(conversation._id.toString()).emit(
  "receive-message",
  populatedMessage
);


    res.status(201).json({
      message: "Message sent.",
      data: populatedMessage
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getMessages = async (req, res) => {
  try {

    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({
        error: "Conversation not found."
      });
    }

    if (
  conversation.buyer.toString() !== req.user.id &&
  conversation.seller.toString() !== req.user.id
) {
      return res.status(403).json({
        error: "Unauthorized."
      });
    }

    const messages = await Message.find({
      conversation: conversation._id
    })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {

    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        error: "Message not found."
      });
    }

    const conversation = await Conversation.findById(message.conversation);

    // Only buyer or seller can access
    if (
      conversation.buyer.toString() !== req.user.id &&
      conversation.seller.toString() !== req.user.id
    ) {
      return res.status(403).json({
        error: "Unauthorized."
      });
    }

    // Sender cannot mark their own message as read
    if (message.sender.toString() === req.user.id) {
      return res.status(400).json({
        error: "You cannot mark your own message as read."
      });
    }

    message.read = true;

    await message.save();

    res.json({
      message: "Message marked as read."
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.editMessage = async (req, res) => {
  try {

    const { text } = req.body;

    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        error: "Message not found."
      });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You can only edit your own messages."
      });
    }

    message.text = text;

    await message.save();

    res.json({
      message: "Message updated.",
      data: message
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {

    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        error: "Message not found."
      });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You can only delete your own messages."
      });
    }

    await message.deleteOne();

    res.json({
      message: "Message deleted."
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};