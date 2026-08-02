const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
  user: req.user.id
})
.sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        error: "Notification not found."
      });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Unauthorized."
      });
    }

    notification.read = true;

    await notification.save();

    res.json({
      message: "Notification marked as read."
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};