const Task = require("../models/Task");
const Activity = require("../models/Activity");

module.exports = (io) => {
  if (!io) throw new Error("Socket.IO instance is required!");

  return {
    createTask: async (req, res) => {
      try {
        const { title, description, status, priority, dueDate, assignedTo } = req.body;
        if (!title) return res.status(400).json({ message: "Title is required" });

        const task = await Task.create({
          title,
          description,
          status,
          priority,
          dueDate,
          assignedTo,
          createdBy: req.user.id,
        });

        await Activity.create({
          task: task._id,
          user: req.user.id,
          action: "created the task",
        });

        console.log("✅ Task Created:", task);
        io.emit("taskCreated", task);
        res.status(201).json(task);
      } catch (error) {
        console.error("❌ Create Task Error:", error);
        res.status(500).json({ message: "Failed to create task", error: error.message });
      }
    },

    getTasks: async (req, res) => {
      try {
        const tasks = await Task.find().populate("assignedTo", "name email");
        res.status(200).json(tasks);
      } catch (error) {
        console.error("❌ Get Tasks Error:", error);
        res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
      }
    },

    updateTask: async (req, res) => {
      try {
        const { title, description, status, priority, dueDate, assignedTo } = req.body;
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const changes = [];
        if (title && title !== task.title) changes.push("updated title");
        if (description && description !== task.description) changes.push("updated description");
        if (status && status !== task.status) changes.push(`changed status to ${status}`);
        if (priority && priority !== task.priority) changes.push(`changed priority to ${priority}`);
        if (dueDate && new Date(dueDate).getTime() !== new Date(task.dueDate).getTime()) changes.push("updated due date");
        if (assignedTo && String(assignedTo) !== String(task.assignedTo)) changes.push("changed assignee");

        task = await Task.findByIdAndUpdate(
          req.params.id,
          { title, description, status, priority, dueDate, assignedTo },
          { new: true }
        ).populate("assignedTo", "name email"); // Ensuring assignedTo is properly populated

        if (changes.length > 0) {
          await Activity.create({
            task: task._id,
            user: req.user.id,
            action: changes.join(", "),
          });
        }

        console.log("🔄 Task Updated:", task);
        io.emit("taskUpdated", task);
        res.status(200).json(task);
      } catch (error) {
        console.error("❌ Update Task Error:", error);
        res.status(500).json({ message: "Failed to update task", error: error.message });
      }
    },

    deleteTask: async (req, res) => {
      try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        await Activity.create({
          task: task._id,
          user: req.user.id,
          action: "deleted the task",
        });

        await task.deleteOne();
        console.log("🗑️ Task Deleted:", req.params.id);
        io.emit("taskDeleted", req.params.id);
        res.status(200).json({ message: "Task deleted successfully" });
      } catch (error) {
        console.error("❌ Delete Task Error:", error);
        res.status(500).json({ message: "Failed to delete task", error: error.message });
      }
    },
  };
};
