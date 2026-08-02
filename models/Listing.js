const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    contact: {
      type: String,
      required: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    images: [
  {
    type: String
  }
  ],

  category: {
  type: String,
  required: true,
  enum: [
    "Electronics",
    "Fashion",
    "Books",
    "Hostel Essentials",
    "Food",
    "Beauty",
    "Services",
    "Sports",
    "Others"
  ]
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },

  status: {
    type: String,
    enum: ["Available", "Not Available", "Sold Out"],
    default: "Available"
  }

  }
);

module.exports = mongoose.model("Listing", listingSchema);