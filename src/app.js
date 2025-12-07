const express = require("express");
const cors = require("cors");

const app = express();
const db = require("./config/db");
const quizRoutes = require("./routes/quizRoutes");

app.use(cors());
app.use(express.json());

// ROUTE: BACKEND CHECK
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// ROUTE: AUTH & USERS
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/teacher", require("./routes/teacherRoutes"));
app.use("/api/teacher/questions", require("./routes/questionRoutes"));
app.use("/api/teacher/quizzes", quizRoutes);
app.use("/api/student", require("./routes/studentRoutes"));





// TEST DATABASE CONNECTION ROUTE
app.get("/test-db", async (req, res) => {
  try {
    await db.raw("SELECT 1");
    res.send("Database connected successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection FAILED: " + err);
  }
}); // <-- THIS WAS MISSING EARLIER

module.exports = app;
