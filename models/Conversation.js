const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },

  buyer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},

seller: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},

lastMessage: {
  type: String,
  default: ""
},

lastMessageAt: {
  type: Date,
  default: null
},

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);