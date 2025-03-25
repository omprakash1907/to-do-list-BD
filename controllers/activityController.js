const Activity = require("../models/Activity");

module.exports = {
  getActivitiesByTask: async (req, res) => {
    try {
      const activities = await Activity.find({ task: req.params.taskId })
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json(activities);
    } catch (error) {
      console.error("❌ Get Activity Error:", error);
      res.status(500).json({ message: "Failed to fetch activity logs", error: error.message });
    }
  },
};
