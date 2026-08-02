const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const { createListing, getListings, deleteListing, updateListing, getListingById, getMyListings, getHomeListings} = require("../controllers/listingController");
const { verifyToken } = require("../middleware/authMiddleware");

// Create a listing
router.post(
  "/",
  verifyToken,
  upload.array("images", 5),
  createListing
);

// Search listings
router.get("/my", verifyToken, getMyListings);
router.get("/home", getHomeListings);
router.get("/", getListings); 
router.get("/:id", getListingById);
router.delete("/:id", verifyToken, deleteListing);
router.patch("/:id", verifyToken, updateListing);


module.exports = router;