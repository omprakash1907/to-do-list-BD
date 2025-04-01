const Notification = require("../models/Notification");

module.exports = (io) => {
  return {
    getNotifications: async (req, res) => {
      try {
        const notifications = await Notification.find({ user: req.user.id })
          .sort({ createdAt: -1 })
          .populate('task', 'title')
          .populate('user', 'name');
        res.status(200).json(notifications);
      } catch (error) {
        console.error("❌ Get Notifications Error:", error);
        res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
      }
    },

    markAsRead: async (req, res) => {
      try {
        const notification = await Notification.findByIdAndUpdate(
          req.params.id,
          { isRead: true },
          { new: true }
        ).populate('task', 'title');
        
        if (!notification) {
          return res.status(404).json({ message: "Notification not found" });
        }

        // Emit update to the user's room
        io.to(notification.user.toString()).emit("notification:update", notification);
        
        res.status(200).json(notification);
      } catch (error) {
        console.error("❌ Mark as Read Error:", error);
        res.status(500).json({ message: "Failed to mark as read", error: error.message });
      }
    },

    markAllAsRead: async (req, res) => {
      try {
        await Notification.updateMany(
          { user: req.user.id, isRead: false },
          { isRead: true }
        );
        
        // Emit event to refresh notifications
        io.to(req.user.id.toString()).emit("notifications:refresh");
        
        res.status(200).json({ message: "All notifications marked as read" });
      } catch (error) {
        console.error("❌ Mark All as Read Error:", error);
        res.status(500).json({ message: "Failed to mark notifications as read", error: error.message });
      }
    },

    createNotification: async (req, res) => {
      try {
        const { user, message, task } = req.body;

        if (!user || !message) {
          return res.status(400).json({ message: "User and message are required" });
        }

        const notification = await Notification.create({
          user,
          message,
          task: task || null,
        });

        // Populate notification before sending
        const populatedNotification = await Notification.findById(notification._id)
          .populate('task', 'title')
          .populate('user', 'name');

        // Emit to specific user's room
        io.to(user.toString()).emit("notification:new", populatedNotification);

        res.status(201).json(populatedNotification);
      } catch (error) {
        console.error("❌ Create Notification Error:", error);
        res.status(500).json({ message: "Failed to create notification", error: error.message });
      }
    },
  };
};