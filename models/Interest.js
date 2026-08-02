const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema({
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

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Interest", interestSchema);