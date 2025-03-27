require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const initializeTaskController = require("./controllers/taskController");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");
const activityRoutes = require("./routes/activityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const initializeCommentController = require("./controllers/commentController");
const initializeNotificationController = require("./controllers/notificationController");

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

    // ✅ Initialize controllers and pass io instance
    const taskController = initializeTaskController(io);
    const commentController = initializeCommentController(io);
    const notificationController = initializeNotificationController(io);

    // ✅ Pass controllers to routes
    app.use("/tasks", taskRoutes(taskController));
    app.use("/auth", authRoutes);
    app.use("/activities", activityRoutes);
    app.use("/comments", commentRoutes(commentController));
    app.use("/notifications", notificationRoutes(notificationController));

    // Handle user connections
    io.on("connection", (socket) => {
      console.log("🔌 New user connected:", socket.id);

      socket.on("join", (userId) => {
        console.log(`📌 User joined: ${userId}`);
        socket.join(userId);
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

startServer();
