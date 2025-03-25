const express = require("express");
const activityController = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:taskId", protect, activityController.getActivitiesByTask);

module.exports = router;
