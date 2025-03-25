const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { addComment, getComments, deleteComment } = require("../controllers/commentController");

const router = express.Router();

router.post("/:taskId", verifyToken, addComment);
router.get("/:taskId", verifyToken, getComments);
router.delete("/:commentId", verifyToken, deleteComment);

module.exports = router;
