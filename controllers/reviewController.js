const Review = require("../models/Review");
const User = require("../models/User");
const Notification = require("../models/Notification");


exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const seller = await User.findById(req.params.sellerId);

    if (!seller) {
      return res.status(404).json({
        error: "Seller not found."
      });
    }

    if (seller._id.toString() === req.user.id) {
      return res.status(400).json({
        error: "You cannot review yourself."
      });
    }
   
    const existingReview = await Review.findOne({
  seller: seller._id,
  reviewer: req.user.id
});

if (existingReview) {
  return res.status(400).json({
    error: "You have already reviewed this seller."
  });
}

    const review = await Review.create({
      seller: seller._id,
      reviewer: req.user.id,
      rating,
      comment
    });

    const reviewer = await User.findById(req.user.id);

await Notification.create({
  user: seller._id,
  message: `${reviewer.name} left you a review.`,
  type: "review",
  referenceId: review._id
});
    res.status(201).json({
      message: "Review added successfully.",
      review
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


exports.getSellerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      seller: req.params.sellerId
    })
    .populate("reviewer", "name");

    res.json(reviews);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getSellerRating = async (req, res) => {
  try {
    const reviews = await Review.find({
      seller: req.params.sellerId
    });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / totalReviews;

    res.json({
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};