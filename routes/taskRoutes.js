const express = require("express");

module.exports = (taskController) => {
  if (!taskController) throw new Error("taskController is undefined");

  const { createTask, getTasks, updateTask, deleteTask } = taskController;

  if (!createTask || !getTasks || !updateTask || !deleteTask) {
    throw new Error("Some taskController methods are undefined.");
  }

  const router = express.Router();

  router.post("/", createTask);
  router.get("/", getTasks);
  router.put("/:id", updateTask);
  router.delete("/:id", deleteTask);

  return router;
};
