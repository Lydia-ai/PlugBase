const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const {
  addFavorite,
  getFavorites,
  removeFavorite
} = require("../controllers/favoriteController");
router.post("/:listingId", verifyToken, addFavorite);
router.get("/", verifyToken, getFavorites);

router.delete("/:listingId", verifyToken, removeFavorite);

module.exports = router;