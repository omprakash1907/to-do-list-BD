const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g., "updated title", "changed status"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
