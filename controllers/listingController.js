const Listing = require("../models/Listing");
const Request = require("../models/Request");
const Notification = require("../models/Notification");
const Review = require("../models/Review");

exports.createListing = async (req, res) =>{
  try{
    
  const { title, description, price, quantity, contact, category } = req.body;

  const imageUrls = req.files
  ? req.files.map(file => file.path)
  : [];

  if (!title || !description || !price || quantity === undefined || !contact || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let status = "Available";

if (quantity === 0) {
  status = "Sold Out";
} else if (req.body.status === "Not Available") {
  status = "Not Available";
}

  const listing = await Listing.create({
  title,
  description,
  price,
  quantity,
  status,
  seller: req.user.id,
  contact,
  images: imageUrls,
  category
});

   // Find matching requests
   const requests = await Request.find({ fulfilled: false });

     const matchingRequests = requests.filter(request =>
  title.toLowerCase().includes(request.item.toLowerCase())
   );

 for (const request of matchingRequests) {
  request.fulfilled = true;
  await request.save();

 await Notification.create({
  user: request.buyer,
  message: `Your requested "${request.item}" is now available.`,
  type: "request",
  referenceId: listing._id
});
}

res.status(201).json({
  message: "Listing created successfully",
  listing,
  matchingRequests
});

} catch (error) {
  res.status(500).json({
    error: error.message
  });
}
};

exports.getListings = async (req, res) => {
  try {
    const { q, maxPrice, category } = req.query;

    const filter = {};

    if (q) {
      filter.title = {
        $regex: q,
        $options: "i"
      };
    }

    if (category) {
      filter.category = category;
    }

    if (maxPrice) {
      filter.price = {
        $lte: Number(maxPrice)
      };
    }

    const listings = await Listing.find(filter)
      .populate("seller", "name email");

    res.json(listings);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found."
      });
    }

    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You are not authorized to delete this listing."
      });
    }

    await Listing.findByIdAndDelete(listingId);

    res.json({
      message: "Listing deleted successfully."
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found."
      });
    }

    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You are not authorized to edit this listing."
      });
    }

    const { title, description, price, quantity, contact, category, status } = req.body;

    if (title) listing.title = title;

if (description) listing.description = description;

if (price !== undefined) listing.price = price;

if (quantity !== undefined) listing.quantity = quantity;

if (contact) listing.contact = contact;

if (category) listing.category = category;

if (status) listing.status = status;

if (listing.quantity === 0) {
  listing.status = "Sold Out";
} else if (status === "Available" || status === "Not Available") {
  listing.status = status;
} else if (listing.status === "Sold Out") {
  listing.status = "Available";
}
    await listing.save();

    const updatedListing = await Listing.findById(listing._id)
      .populate("seller", "name email");

    res.json({
      message: "Listing updated successfully.",
      listing: updatedListing
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getListingById = async (req, res) => {
  try {

    const listing = await Listing.findById(req.params.id)
      .populate("seller", "name profilePicture bio");

      const publicListing = {
  _id: listing._id,
  title: listing.title,
  price: listing.price,
  seller: listing.seller,
  contact: listing.contact,
  images: listing.images,
  category: listing.category,
  description: listing.description,
  status: listing.status,
  createdAt: listing.createdAt
};

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found."
      });
    }

    const reviews = await Review.find({
      seller: listing.seller._id
    })
      .populate("reviewer", "name profilePicture")
      .sort({ createdAt: -1 });

    const averageRating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    const relatedListings = await Listing.find({
      category: listing.category,
      _id: { $ne: listing._id },
      status: "Available"
    })
      .limit(6)
      .populate("seller", "name");

    res.json({
  listing: publicListing,

  seller: {
    ...listing.seller.toObject(),
    rating: {
      average: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length
    }
  },

  reviews,

  relatedListings
});

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      seller: req.user.id
    }).populate("seller", "name email");

    res.json(listings);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getHomeListings = async (req, res) => {
  try {

    const featured = await Listing.find({
      status: "Available"
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("seller", "name profilePicture");

    const latest = await Listing.find({
      status: "Available"
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .populate("seller", "name profilePicture");

    const categories = await Listing.distinct("category");

    const publicFeatured = featured.map(listing => ({
      _id: listing._id,
      title: listing.title,
      price: listing.price,
      seller: listing.seller,
      contact: listing.contact,
      images: listing.images,
      category: listing.category,
      description: listing.description,
      status: listing.status,
      createdAt: listing.createdAt
    }));

    const publicLatest = latest.map(listing => ({
      _id: listing._id,
      title: listing.title,
      price: listing.price,
      seller: listing.seller,
      contact: listing.contact,
      images: listing.images,
      category: listing.category,
      description: listing.description,
      status: listing.status,
      createdAt: listing.createdAt
    }));

    res.json({
      featured: publicFeatured,
      latest: publicLatest,
      categories
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};