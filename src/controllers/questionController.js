const db = require("../config/db");

module.exports = {
  // Create a new question
  async create(req, res) {
    try {
      const teacherId = req.user.id;
      const { text, type, options } = req.body;

      if (!text) {
        return res.status(400).json({ message: "Question text required" });
      }

      const [questionId] = await db("questions").insert({
        teacher_id: teacherId,
        text,
        type: type || "mcq",
      });

      if (options && Array.isArray(options)) {
        for (let opt of options) {
          await db("question_options").insert({
            question_id: questionId,
            option_text: opt.text,
            is_correct: opt.is_correct || false,
          });
        }
      }

      res.json({ message: "Question created", questionId });
    } catch (err) {
      console.error("CREATE QUESTION ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // List all questions of the teacher
  async list(req, res) {
    try {
      const teacherId = req.user.id;

      const questions = await db("questions").where({ teacher_id: teacherId });

      res.json(questions);
    } catch (err) {
      console.error("LIST QUESTIONS ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Update question
  async update(req, res) {
    try {
      const { id } = req.params;
      const { text } = req.body;

      await db("questions").where({ id }).update({ text });

      res.json({ message: "Question updated" });
    } catch (err) {
      console.error("UPDATE QUESTION ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Delete question
  async remove(req, res) {
    try {
      const { id } = req.params;

      await db("question_options").where({ question_id: id }).del();
      await db("questions").where({ id }).del();

      res.json({ message: "Question deleted" });
    } catch (err) {
      console.error("DELETE QUESTION ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
};
