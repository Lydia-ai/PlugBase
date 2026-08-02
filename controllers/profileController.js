const User = require("../models/User");
const Listing = require("../models/Listing");
const Review = require("../models/Review");


exports.getUserProfile = async (req, res) => {
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
    })
    .populate("reviewer", "name")
    .sort({
      createdAt: -1
    });


    const totalReviews = reviews.length;

    const averageRating = totalReviews === 0
      ? 0
      : reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / totalReviews;


    res.json({

      user,

      rating: {
        average: Number(averageRating.toFixed(1)),
        totalReviews
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