const express = require("express");
const { protect } = require("../middleware/authMiddleware"); // Ensure correct import

module.exports = (notificationController) => {
  if (!notificationController) throw new Error("notificationController is undefined");

  const { getNotifications, markAsRead, markAllAsRead } = notificationController;

  if (
    typeof getNotifications !== "function" ||
    typeof markAsRead !== "function" ||
    typeof markAllAsRead !== "function"
  ) {
    throw new Error("Some notificationController methods are not functions.");
  }

  const router = express.Router();

  router.get("/", protect, getNotifications);
  router.put("/:id/read", protect, markAsRead);
  router.put("/mark-all-read", protect, markAllAsRead);

  return router;
};
