const db = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports = {
  async getAllUsers(req, res) {
    const users = await db("users").select("id", "name", "email", "role");
    res.json({ users });
  },

  async createUser(req, res) {
    try {
      const { name, email, password, role } = req.body;

      const hashed = await bcrypt.hash(password, 10);

      await db("users").insert({
        name,
        email,
        password: hashed,
        role
      });

      res.json({ message: "User created" });
    } catch (err) {
      console.error("CREATE USER ERROR:", err);
      res.status(500).json({ message: "Failed to create user" });
    }
  },

  async deleteUser(req, res) {
    const id = req.params.id;
    await db("users").where("id", id).delete();
    res.json({ message: "User deleted" });
  },

  async getAllQuizzes(req, res) {
    const quizzes = await db("quizzes").select("id", "title", "description");
    res.json({ quizzes });
  },

  async getLeaderboard(req, res) {
    const data = await db("attempts")
      .join("users", "attempts.student_id", "users.id")
      .join("quizzes", "attempts.quiz_id", "quizzes.id")
      .select(
        "users.name as student_name",
        "quizzes.title as quiz_title",
        "attempts.score",
        "attempts.total"
      );

    res.json({ leaderboard: data });
  }
};
