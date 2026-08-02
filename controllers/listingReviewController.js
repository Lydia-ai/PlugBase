const ListingReview = require("../models/ListingReview");
const Listing = require("../models/Listing");


exports.createListingReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const listing = await Listing.findById(req.params.listingId);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found."
      });
    }

    // Seller cannot review their own listing
    if (listing.seller.toString() === req.user.id) {
      return res.status(400).json({
        error: "You cannot review your own listing."
      });
    }

    const existingReview = await ListingReview.findOne({
  listing: listing._id,
  reviewer: req.user.id
});

if (existingReview) {
  return res.status(400).json({
    error: "You have already reviewed this listing."
  });
}

    const review = await ListingReview.create({
      listing: listing._id,
      reviewer: req.user.id,
      rating,
      comment
    });

    res.status(201).json({
      message: "Listing review added successfully.",
      review
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


exports.getListingReviews = async (req, res) => {
  try {
    const reviews = await ListingReview.find({
      listing: req.params.listingId
    })
      .populate("reviewer", "name");

    res.json(reviews);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getListingRating = async (req, res) => {
  try {
    const reviews = await ListingReview.find({
      listing: req.params.listingId
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