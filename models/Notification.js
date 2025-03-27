const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who receives the notification
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false }, // Mark notification as read/unread
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, // Related task
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
