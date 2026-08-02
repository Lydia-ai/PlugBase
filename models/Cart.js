const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

cartSchema.index(
  {
    buyer: 1,
    listing: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model("Cart", cartSchema);