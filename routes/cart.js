const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    messageSeller
} = require("../controllers/cartController");

router.post("/", verifyToken, addToCart);

router.get("/", verifyToken, getCart);

router.patch("/:itemId", verifyToken, updateCartItem);

router.delete("/:itemId", verifyToken, removeCartItem);

router.delete("/", verifyToken, clearCart);

router.post("/:itemId/message", verifyToken, messageSeller);


module.exports = router;