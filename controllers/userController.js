const User = require("../models/User");
const Listing = require("../models/Listing");
const Favorite = require("../models/Favorite");
const Cart = require("../models/Cart");
const Conversation = require("../models/Conversation");
const Notification = require("../models/Notification");
const Review = require("../models/Review");

exports.getSellerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found."
      });
    }

    const listings = await Listing.find({
      seller: user._id
    });

    const reviews = await Review.find({
      seller: user._id
    }).populate("reviewer", "name");

    const averageRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      user,
      rating: {
        average: Number(averageRating.toFixed(1)),
        totalReviews: reviews.length
      },
      listings,
      reviews
    });

  } catch(error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found."
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


exports.updateMyProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found."
      });
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getMyFullProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");


    const listings = await Listing.find({
      seller: user._id
    });


    const favorites = await Favorite.find({
      user: user._id
    });


    const cartItems = await Cart.find({
      buyer: user._id
    });


    const conversations = await Conversation.find({
      $or: [
        { buyer: user._id },
        { seller: user._id }
      ]
    });


    const notifications = await Notification.find({
      user: user._id
    });


    const reviews = await Review.find({
      seller: user._id
    });


    res.json({
      user,

      activity: {
        listings,
        favoritesCount: favorites.length,
        cartItemsCount: cartItems.length,
        conversationsCount: conversations.length,
        notificationsCount: notifications.length,
        reviewsReceived: reviews.length
      }
    });


  } catch(error) {

    res.status(500).json({
      error: error.message
    });

  }
};