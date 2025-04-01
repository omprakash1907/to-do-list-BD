const Notification = require("../models/Notification");

const sendNotification = async (io, userId, message, taskId = null) => {
  try {
    const notification = await Notification.create({
      user: userId,
      message,
      task: taskId,
    });

    // Populate notification data before emitting
    const populatedNotification = await Notification.findById(notification._id)
      .populate('task', 'title')
      .populate('user', 'name');

    // Emit to specific user's room
    io.to(userId.toString()).emit("notification:new", populatedNotification);

    console.log("📩 Notification sent to user:", userId);
    return populatedNotification;
  } catch (error) {
    console.error("❌ Notification Error:", error);
    throw error; // Let the caller handle the error
  }
};

module.exports = sendNotification;