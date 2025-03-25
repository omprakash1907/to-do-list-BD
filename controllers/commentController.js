const Comment = require("../models/Comment");

module.exports = (io) => {
  const addComment = async (req, res) => {
    try {
      const { text } = req.body;
      const { taskId } = req.params;
      const userId = req.user.id;

      if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

      const comment = await Comment.create({ task: taskId, user: userId, text });

      // Emit event to notify all users
      io.emit("newComment", { taskId, comment });

      res.status(201).json(comment);
    } catch (error) {
      console.error("Add Comment Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  const getComments = async (req, res) => {
    try {
      const { taskId } = req.params;
      const comments = await Comment.find({ task: taskId }).populate("user", "name email");
      res.status(200).json(comments);
    } catch (error) {
      console.error("Get Comments Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  const deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      await Comment.findByIdAndDelete(commentId);
      
      // Emit event to update UI
      io.emit("commentDeleted", commentId);

      res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
      console.error("Delete Comment Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  return { addComment, getComments, deleteComment };
};
