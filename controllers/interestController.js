const Interest = require("../models/Interest");

exports.createInterest = async (req, res) => {
  try {
    const { item } = req.body;

    if (!item) {
      return res.status(400).json({
        error: "Item is required"
      });
    }

    const interest = await Interest.create({
      item,
      buyer: req.user.id
    });

    res.status(201).json({
      message: "Interest recorded successfully",
      interest
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};