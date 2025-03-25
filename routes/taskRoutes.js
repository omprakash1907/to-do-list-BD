const express = require("express");
const { protect } = require("../middleware/authMiddleware"); // Import protect middleware

module.exports = (taskController) => {
  if (!taskController) throw new Error("taskController is undefined");

  const { createTask, getTasks, updateTask, deleteTask } = taskController;

  if (!createTask || !getTasks || !updateTask || !deleteTask) {
    throw new Error("Some taskController methods are undefined.");
  }

  const router = express.Router();

  router.post("/", protect, createTask);
  router.get("/", protect, getTasks);
  router.put("/:id", protect, updateTask);
  router.delete("/:id", protect, deleteTask);

  return router;
};
