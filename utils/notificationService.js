const Notification = require("../models/Notification");

/**
 * Store a notification in the database and emit it via Socket.IO
 * @param {Object} io - The Socket.IO instance
 * @param {String} userId - The ID of the user receiving the notification
 * @param {String} message - The notification message
 * @param {String} [taskId] - The related task ID (optional)
 */
const sendNotification = async (io, userId, message, taskId = null) => {
  try {
    const notification = await Notification.create({
      user: userId,
      message,
      task: taskId,
    });

    // Emit notification to the user's socket room
    io.to(userId.toString()).emit("notification", notification);

    console.log("📩 Notification stored and sent:", notification);
  } catch (error) {
    console.error("❌ Error storing notification:", error);
  }
};

module.exports = sendNotification;
