const express = require("express");
const { protect } = require("../middleware/authMiddleware");

module.exports = (notificationController) => {
  if (!notificationController) throw new Error("notificationController is undefined");

  const { getNotifications, markAsRead, markAllAsRead, createNotification } = notificationController;

  if (
    typeof getNotifications !== "function" ||
    typeof markAsRead !== "function" ||
    typeof markAllAsRead !== "function" ||
    typeof createNotification !== "function"
  ) {
    throw new Error("Some notificationController methods are not functions.");
  }

  const router = express.Router();

  router.get("/", protect, getNotifications);
  router.put("/:id/read", protect, markAsRead);
  router.put("/mark-all-read", protect, markAllAsRead);
  router.post("/", protect, createNotification); // ✅ Add this new route

  return router;
};
