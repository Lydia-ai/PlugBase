const express = require("express");
const router = express.Router();

const {
  createReview,
  getSellerReviews,
  getSellerRating
} = require("../controllers/reviewController");

const { verifyToken } = require("../middleware/authMiddleware");


router.post("/:sellerId", verifyToken, createReview);

router.get("/:sellerId", getSellerReviews);
router.get("/:sellerId/rating", getSellerRating);

module.exports = router;