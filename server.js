require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const initializeTaskController = require("./controllers/taskController");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] },
});

const startServer = async () => {
  try {
    await connectDB();

    app.use(cors());
    app.use(express.json());

    // ✅ Pass io instance to taskController
    const taskController = initializeTaskController(io);

    // ✅ Pass taskController to taskRoutes
    app.use("/tasks", taskRoutes(taskController));

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

startServer();

// ✅ Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("🔗 Client connected:", socket.id);

  socket.on("disconnect", () => console.log("❌ Client disconnected:", socket.id));
});
