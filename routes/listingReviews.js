const express = require("express");
const router = express.Router();

const {
  createListingReview,
  getListingReviews,
  getListingRating
} = require("../controllers/listingReviewController");

const { verifyToken } = require("../middleware/authMiddleware");


router.post("/:listingId", verifyToken, createListingReview);

router.get("/:listingId", getListingReviews);

router.get("/:listingId/rating", getListingRating);


module.exports = router;