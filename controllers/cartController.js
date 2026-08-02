const Cart = require("../models/Cart");
const Listing = require("../models/Listing");
const Conversation = require("../models/Conversation");

exports.addToCart = async (req, res) => {
  try {

    const { listingId, quantity } = req.body;

    if (!listingId) {
      return res.status(400).json({
        error: "Listing is required."
      });
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found."
      });
    }

    if (listing.seller.toString() === req.user.id) {
      return res.status(400).json({
        error: "You cannot add your own listing to your cart."
     });
    }

    if (listing.status === "Sold Out") {
      return res.status(400).json({
        error: "This item is sold out."
      });
    }

    if (listing.status === "Not Available") {
      return res.status(400).json({
        error: "This item is currently unavailable."
      });
    }

    let cartItem = await Cart.findOne({
      buyer: req.user.id,
      listing: listingId
    });

    if (cartItem) {

      cartItem.quantity += quantity || 1;

      await cartItem.save();

      return res.json({
        message: "Cart updated.",
        cartItem
      });

    }

    cartItem = await Cart.create({
      buyer: req.user.id,
      listing: listingId,
      quantity: quantity || 1
    });

    res.status(201).json({
      message: "Added to cart.",
      cartItem
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getCart = async (req, res) => {
  try {

    const cart = await Cart.find({
      buyer: req.user.id
    })
    .populate({
      path: "listing",
      populate: {
        path: "seller",
        select: "name email"
      }
    });

    res.json(cart);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {

    const { quantity } = req.body;

    const cartItem = await Cart.findById(req.params.itemId);

    if (!cartItem) {
      return res.status(404).json({
        error: "Cart item not found."
      });
    }

    if (cartItem.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Unauthorized."
      });
    }

    cartItem.quantity = quantity;

    await cartItem.save();

    res.json({
      message: "Cart updated.",
      cartItem
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.removeCartItem = async (req, res) => {
  try {

    const cartItem = await Cart.findById(req.params.itemId);

    if (!cartItem) {
      return res.status(404).json({
        error: "Cart item not found."
      });
    }

    if (cartItem.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Unauthorized."
      });
    }

    await cartItem.deleteOne();

    res.json({
      message: "Item removed from cart."
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.clearCart = async (req, res) => {
  try {

    await Cart.deleteMany({
      buyer: req.user.id
    });

    res.json({
      message: "Cart cleared."
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.messageSeller = async (req, res) => {
  try {

    const cartItem = await Cart.findById(req.params.itemId)
      .populate("listing");

    if (!cartItem) {
      return res.status(404).json({
        error: "Cart item not found."
      });
    }

    // Make sure this cart belongs to the logged-in buyer
    if (cartItem.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Unauthorized."
      });
    }

    const listing = cartItem.listing;

    // Prevent seller from messaging themselves
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


    res.json({
      message: "Conversation ready.",
      conversation
    });


  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};