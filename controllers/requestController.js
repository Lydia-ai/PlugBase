const Request = require("../models/Request");
const Listing = require("../models/Listing");

exports.createRequest = async (req, res) => {
  try {
    const { item } = req.body;

    if (!item) {
      return res.status(400).json({
        error: "Missing fields"
      });
    }

    // Auto-match listings in MongoDB
    const matches = await Listing.find({
      title: {
        $regex: item,
        $options: "i"
      }
    }).populate("seller", "name email");


    if (matches.length > 0) {
      return res.status(200).json({
        message: "Item already available",
        matches
      });
    }


    const request = await Request.create({
      item,
      buyer: req.user.id,
      fulfilled: false,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
    });


    res.status(201).json({
      message: "Request saved, waiting for seller",
      request
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("buyer", "name email");

    res.json(requests);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};