const db = require("../config/db");

const quizController = {
  async createFullQuiz(req, res) {
    try {
      const teacherId = req.user.id;
      const { title, description, questions } = req.body;

      if (!title || !questions || questions.length === 0) {
        return res.status(400).json({ message: "Missing quiz data" });
      }

      const [quizId] = await db("quizzes").insert({
        teacher_id: teacherId,
        title,
        description,
      });

      for (const q of questions) {
        const [questionId] = await db("quiz_questions").insert({
          quiz_id: quizId,
          question_text: q.text
        });

        for (let i = 0; i < q.options.length; i++) {
          await db("quiz_options").insert({
            question_id: questionId,
            option_text: q.options[i],
            is_correct: q.correctAnswer === i ? 1 : 0
          });
        }
      }

      res.json({ message: "Quiz created successfully", quizId });

    } catch (err) {
      console.error("QUIZ CREATE ERROR:", err);
      res.status(500).json({ message: "Quiz creation failed" });
    }
  },

  async getQuiz(req, res) {
    try {
      const quizId = req.params.id;

      const quiz = await db("quizzes").where("id", quizId).first();
      const questions = await db("quiz_questions").where("quiz_id", quizId);

      for (const q of questions) {
        q.options = await db("quiz_options").where("question_id", q.id);
      }

      res.json({ quiz, questions });

    } catch (err) {
      console.error("GET QUIZ ERROR:", err);
      res.status(500).json({ message: "Error fetching quiz" });
    }
  },

  async listQuizzes(req, res) {
    try {
      const teacherId = req.user.id;

      const quizzes = await db("quizzes")
        .where("teacher_id", teacherId)
        .select("id", "title", "description", "created_at");

      res.json({ quizzes });
    } catch (err) {
      console.error("LIST QUIZZES ERROR:", err);
      res.status(500).json({ message: "Failed to load quizzes" });
    }
  }
};

module.exports = quizController;
