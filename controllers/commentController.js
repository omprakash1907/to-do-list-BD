const Comment = require("../models/Comment");

module.exports = (io) => {
  if (!io) throw new Error("Socket.IO instance is required!");

  return {
    addComment: async (req, res) => {
      try {
        const { text, taskId } = req.body;
        if (!req.user || !req.user.id) {
          return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        if (!text || !taskId) return res.status(400).json({ message: "Text and Task ID are required" });

        const comment = await Comment.create({
          text,
          task: taskId,
          user: req.user.id,
        });

        io.emit("commentAdded", comment);
        res.status(201).json(comment);
      } catch (error) {
        console.error("❌ Add Comment Error:", error);
        res.status(500).json({ message: "Failed to add comment", error: error.message });
      }
    },

    getComments: async (req, res) => {
      try {
        const comments = await Comment.find({ task: req.params.taskId }).populate("user", "name email");
        res.status(200).json(comments);
      } catch (error) {
        console.error("❌ Get Comments Error:", error);
        res.status(500).json({ message: "Failed to fetch comments", error: error.message });
      }
    },

    updateComment: async (req, res) => {
      try {
        const { text } = req.body;
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        comment.text = text || comment.text;
        await comment.save();

        io.emit("commentUpdated", comment);
        res.status(200).json(comment);
      } catch (error) {
        console.error("❌ Update Comment Error:", error);
        res.status(500).json({ message: "Failed to update comment", error: error.message });
      }
    },

    deleteComment: async (req, res) => {
      try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        await comment.deleteOne();
        io.emit("commentDeleted", req.params.id);
        res.status(200).json({ message: "Comment deleted successfully" });
      } catch (error) {
        console.error("❌ Delete Comment Error:", error);
        res.status(500).json({ message: "Failed to delete comment", error: error.message });
      }
    },
  };
};
