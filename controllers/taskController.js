const Task = require("../models/Task");

module.exports = (io) => {
  if (!io) throw new Error("Socket.IO instance is required!");

  return {
    createTask: async (req, res) => {
      try {
        const { title, description, status, priority, dueDate, assignedTo } = req.body;
        if (!title) return res.status(400).json({ message: "Title is required" });

        const task = await Task.create({
          title, description, status, priority, dueDate, assignedTo, createdBy: req.user.id,
        });

        io.emit("taskCreated", task);
        res.status(201).json(task);
      } catch (error) {
        console.error("Create Task Error:", error);
        res.status(500).json({ message: "Server error" });
      }
    },

    getTasks: async (req, res) => {
      try {
        const tasks = await Task.find().populate("assignedTo", "name email");
        res.status(200).json(tasks);
      } catch (error) {
        console.error("Get Tasks Error:", error);
        res.status(500).json({ message: "Server error" });
      }
    },

    updateTask: async (req, res) => {
      try {
        const { title, description, status, priority, dueDate, assignedTo } = req.body;
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task = await Task.findByIdAndUpdate(req.params.id, { title, description, status, priority, dueDate, assignedTo }, { new: true });

        io.emit("taskUpdated", task);
        res.status(200).json(task);
      } catch (error) {
        console.error("Update Task Error:", error);
        res.status(500).json({ message: "Server error" });
      }
    },

    deleteTask: async (req, res) => {
      try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        await task.deleteOne();
        io.emit("taskDeleted", req.params.id);
        res.status(200).json({ message: "Task deleted successfully" });
      } catch (error) {
        console.error("Delete Task Error:", error);
        res.status(500).json({ message: "Server error" });
      }
    },
  };
};
