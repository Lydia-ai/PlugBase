const Conversation = require("../models/Conversation");

const Listing = require("../models/Listing");


exports.createConversation = async (req, res) => {
  try {

    const listing = await Listing.findById(req.params.listingId);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found."
      });
    }

    // Seller cannot start a conversation with themselves
    if (listing.seller.toString() === req.user.id) {
      return res.status(400).json({
        error: "You cannot message yourself."
      });
    }

   let conversation = await Conversation.findOne({
  listing: listing._id,
  buyer: req.user.id,
  seller: listing.seller
});

    if (!conversation) {
      conversation = await Conversation.create({
  listing: listing._id,
  buyer: req.user.id,
  seller: listing.seller
});
    }

    res.status(201).json({
      message: "Conversation ready.",
      conversation
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getMyConversations = async (req, res) => {
  try {

    const conversations = await Conversation.find({
      $or: [
        { buyer: req.user.id },
        { seller: req.user.id }
      ]
    })
      .populate("listing", "title images")
      .populate("buyer", "name")
      .populate("seller", "name");



    const result = conversations.map(conversation => {

  const otherUser =
    conversation.buyer._id.toString() === req.user.id
      ? conversation.seller
      : conversation.buyer;

  return {
    conversationId: conversation._id,

    listing: conversation.listing,

    otherUser,

    lastMessage: conversation.lastMessage,

    lastMessageAt: conversation.lastMessageAt
  };
});

    res.json(result);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};