const express = require("express");
const { protect } = require("../middleware/authMiddleware"); // Import middleware

module.exports = (commentController) => {
  if (!commentController) throw new Error("commentController is undefined");

  const { addComment, getComments, updateComment, deleteComment } = commentController;

  if (!addComment || !getComments || !updateComment || !deleteComment) {
    throw new Error("Some commentController methods are undefined.");
  }

  const router = express.Router();

  router.post("/", protect, addComment);
  router.get("/:taskId", protect, getComments);
  router.put("/:id", protect, updateComment);
  router.delete("/:id", protect, deleteComment);

  return router;
};
