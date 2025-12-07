const db = require("../config/db");

const attemptController = {
  // SUBMIT QUIZ
  async submitQuiz(req, res) {
    try {
      const studentId = req.user.id;
      const { quizId } = req.params;
      const { answers, timeTaken } = req.body;

      // Create attempt record
      const [attemptId] = await db("attempts").insert({
        quiz_id: quizId,
        student_id: studentId,
        score: 0,
        total: 0,
        time_taken: timeTaken || null
      });

      let score = 0;
      let total = 0;

      for (const ans of answers) {
        total++;

        // Correct option
        const correctOption = await db("quiz_options")
          .where("question_id", ans.questionId)
          .andWhere("is_correct", 1)
          .first();

        const isCorrect =
          correctOption && correctOption.id === ans.selectedOptionId;

        if (isCorrect) score++;

        // Save answer
        await db("attempt_answers").insert({
          attempt_id: attemptId,
          question_id: ans.questionId,
          selected_option_id: ans.selectedOptionId,
          is_correct: isCorrect ? 1 : 0
        });
      }

      // Update attempt score
      await db("attempts").where("id", attemptId).update({
        score,
        total
      });

      res.json({
        message: "Quiz submitted",
        score,
        total
      });
    } catch (err) {
      console.error("SUBMIT QUIZ ERROR:", err);
      res.status(500).json({ message: "Quiz submission failed" });
    }
  },

  // STUDENT VIEW ATTEMPTS
  async getStudentAttempts(req, res) {
    try {
      const studentId = req.user.id;

      const attempts = await db("attempts")
        .join("quizzes", "attempts.quiz_id", "quizzes.id")
        .select(
          "attempts.id",
          "quizzes.title",
          "attempts.score",
          "attempts.total",
          "attempts.time_taken",
          "attempts.created_at"
        )
        .where("attempts.student_id", studentId);

      res.json({ attempts });
    } catch (err) {
      console.error("VIEW RESULTS ERROR:", err);
      res.status(500).json({ message: "Could not load results" });
    }
  }
};

module.exports = attemptController;
