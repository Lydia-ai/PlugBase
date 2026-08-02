const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    trim: true
  },

  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  fulfilled: {
    type: Boolean,
    default: false
  },

  expiresAt: {
    type: Date,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Request", requestSchema);