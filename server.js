require("dotenv").config();

const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const app = express();
app.use(cors({
  origin: "http://localhost:8443",
  credentials: true
}));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
app.set("io", io);
const initializeSocket = require("./socket/socket");
initializeSocket(io);
// helper functions
const listingRoutes = require("./routes/listings");
const requestRoutes = require("./routes/requests");
const interestRoutes = require("./routes/interests");
const notificationRoutes = require("./routes/notifications");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const favoriteRoutes = require("./routes/favorites");
const reviewRoutes = require("./routes/reviews");
const listingReviewRoutes = require("./routes/listingReviews");
const conversationRoutes = require("./routes/conversations");
const messageRoutes = require("./routes/messages");
const cartRoutes = require("./routes/cart");

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Plugbase backend is running 🚀");
});

app.use("/listings", listingRoutes);
app.use("/requests", requestRoutes);
app.use("/interests", interestRoutes);
app.use("/notifications", notificationRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/reviews", reviewRoutes);
app.use("/listing-reviews", listingReviewRoutes);
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);
app.use("/cart", cartRoutes);

// Start server only after DB connection
const startServer = async () => {
  try {
    await connectDB();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`PlugBase server running on port ${PORT}`);
});

  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

startServer();
