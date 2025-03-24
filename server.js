require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require('./routes/taskRoutes')


const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use("/tasks", taskRoutes);


app.get("/", (req, res) => {
  res.send("Real-Time To-Do App Backend is Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port https://localhost:${PORT}`);
  connectDB()
});
