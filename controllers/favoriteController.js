const Favorite = require("../models/Favorite");
const Listing = require("../models/Listing");

exports.addFavorite = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found."
      });
    }

    const existing = await Favorite.findOne({
      user: req.user.id,
      listing: req.params.listingId
    });

    if (existing) {
      return res.status(400).json({
        error: "Listing already in favorites."
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      listing: req.params.listingId
    });

    res.status(201).json({
      message: "Added to favorites.",
      favorite
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user.id
    }).populate({
      path: "listing",
      populate: {
        path: "seller",
        select: "name"
      }
    });

    res.json(favorites);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      listing: req.params.listingId
    });

    if (!favorite) {
      return res.status(404).json({
        error: "Favorite not found."
      });
    }

    res.json({
      message: "Favorite removed successfully."
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};