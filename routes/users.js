const express = require("express");
const router = express.Router();

const {
  getSellerProfile,
  getMyProfile,
  updateMyProfile,
  getMyFullProfile
} = require("../controllers/userController");

const { verifyToken } = require("../middleware/authMiddleware");


router.get("/me", verifyToken, getMyProfile);

router.patch("/me", verifyToken, updateMyProfile);
router.get("/me/profile", verifyToken, getMyFullProfile);
router.get("/:id", getSellerProfile);


module.exports = router;