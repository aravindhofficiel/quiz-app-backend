const db = require("../config/db");

const teacherController = {

  // CREATE QUESTION
  async createQuestion(req, res) {
    try {
      const teacherId = req.user.id;
      const { text, options, correctAnswer } = req.body;

      if (!text || !options || options.length < 2) {
        return res.status(400).json({ message: "Invalid question data" });
      }

      const [questionId] = await db("quiz_questions").insert({
        quiz_id: null, // question not linked yet
        question_text: text
      });

      for (let i = 0; i < options.length; i++) {
        await db("quiz_options").insert({
          question_id: questionId,
          option_text: options[i],
          is_correct: correctAnswer === i ? 1 : 0
        });
      }

      res.json({ message: "Question created", questionId });
    } catch (err) {
      console.error("QUESTION CREATE ERROR:", err);
      res.status(500).json({ message: "Failed to create question" });
    }
  },

  // LIST QUESTIONS
  async listQuestions(req, res) {
    try {
      const questions = await db("quiz_questions");

      for (const q of questions) {
        q.options = await db("quiz_options").where("question_id", q.id);
      }

      res.json({ questions });
    } catch (err) {
      console.error("LIST QUESTIONS ERROR:", err);
      res.status(500).json({ message: "Failed to load questions" });
    }
  },

  // UPDATE QUESTION
  async updateQuestion(req, res) {
    try {
      const questionId = req.params.id;
      const { text, options, correctAnswer } = req.body;

      await db("quiz_questions")
        .where("id", questionId)
        .update({ question_text: text });

      await db("quiz_options").where("question_id", questionId).delete();

      for (let i = 0; i < options.length; i++) {
        await db("quiz_options").insert({
          question_id: questionId,
          option_text: options[i],
          is_correct: correctAnswer === i ? 1 : 0
        });
      }

      res.json({ message: "Question updated" });
    } catch (err) {
      console.error("UPDATE QUESTION ERROR:", err);
      res.status(500).json({ message: "Failed to update question" });
    }
  },

  // DELETE QUESTION
  async deleteQuestion(req, res) {
    try {
      const questionId = req.params.id;
      await db("quiz_questions").where("id", questionId).delete();
      res.json({ message: "Question deleted" });
    } catch (err) {
      console.error("DELETE QUESTION ERROR:", err);
      res.status(500).json({ message: "Failed to delete question" });
    }
  },

  // CREATE QUIZ
  async createQuiz(req, res) {
    try {
      const teacherId = req.user.id;
      const { title, description, questions } = req.body;

      const [quizId] = await db("quizzes").insert({
        teacher_id: teacherId,
        title,
        description
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

      res.json({ message: "Quiz created", quizId });
    } catch (err) {
      console.error("QUIZ CREATE ERROR:", err);
      res.status(500).json({ message: "Failed to create quiz" });
    }
  },

  // LIST QUIZZES
  async listQuizzes(req, res) {
    try {
      const teacherId = req.user.id;
      const quizzes = await db("quizzes").where("teacher_id", teacherId);
      res.json({ quizzes });
    } catch (err) {
      console.error("LIST QUIZZES ERROR:", err);
      res.status(500).json({ message: "Failed to load quizzes" });
    }
  },

  // GET QUIZ
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
      res.status(500).json({ message: "Failed to load quiz" });
    }
  },

  // DELETE QUIZ
  async deleteQuiz(req, res) {
    try {
      const quizId = req.params.id;
      await db("quizzes").where("id", quizId).delete();
      res.json({ message: "Quiz deleted" });
    } catch (err) {
      console.error("DELETE QUIZ ERROR:", err);
      res.status(500).json({ message: "Failed to delete quiz" });
    }
  },

  // LIST RESULTS
  async listResults(req, res) {
    try {
      const teacherId = req.user.id;

      const results = await db("attempts")
        .join("users", "attempts.student_id", "users.id")
        .join("quizzes", "attempts.quiz_id", "quizzes.id")
        .select(
          "users.name",
          "quizzes.title",
          "attempts.score",
          "attempts.total",
          "attempts.time_taken",
          "attempts.created_at"
        )
        .where("quizzes.teacher_id", teacherId);

      res.json({ results });
    } catch (err) {
      console.error("RESULTS ERROR:", err);
      res.status(500).json({ message: "Failed to load results" });
    }
  }

};

module.exports = teacherController;
