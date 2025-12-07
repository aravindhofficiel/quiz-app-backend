const db = require("../config/db");

module.exports = {

  // 1) LIST ALL QUIZZES FOR STUDENTS
  async getAvailableQuizzes(req, res) {
    try {
      const quizzes = await db("quizzes")
        .select("id", "title", "description", "created_at");

      res.json({ quizzes });
    } catch (err) {
      console.error("AVAILABLE QUIZ ERROR:", err);
      res.status(500).json({ message: "Failed to load quizzes" });
    }
  },

  // 2) FETCH QUIZ QUESTIONS + OPTIONS
  async getQuizForStudent(req, res) {
    try {
      const { id } = req.params;

      const quiz = await db("quizzes").where("id", id).first();
      if (!quiz) return res.status(404).json({ message: "Quiz not found" });

      const questions = await db("quiz_questions").where("quiz_id", id);
      console.log("QUESTIONS FROM DB:", questions);


      for (const q of questions) {
        q.options = await db("quiz_options")
          .where("question_id", q.id)
          .select("id", "option_text", "is_correct");
      }

     res.json({
  id: quiz.id,
  title: quiz.title,
  description: quiz.description,
  questions
});

    } catch (err) {
      console.error("GET STUDENT QUIZ ERROR:", err);
      res.status(500).json({ message: "Could not load quiz" });
    }
  },

  // 3) SUBMIT QUIZ
  async submitQuiz(req, res) {
    try {
      const studentId = req.user.id;
      const { id } = req.params;
      const { answers, timeTaken } = req.body;

      const [attemptId] = await db("attempts").insert({
        quiz_id: id,
        student_id: studentId,
        score: 0,
        total: 0,
        time_taken: timeTaken || null
      });

      let score = 0;
      let total = 0;

      for (const ans of answers) {
        total++;

        const correct = await db("quiz_options")
          .where("question_id", ans.questionId)
          .andWhere("is_correct", 1)
          .first();

        const isCorrect = correct && correct.id === ans.selectedOptionId;

        if (isCorrect) score++;

        await db("attempt_answers").insert({
          attempt_id: attemptId,
          question_id: ans.questionId,
          selected_option_id: ans.selectedOptionId,
          is_correct: isCorrect ? 1 : 0
        });
      }

      await db("attempts").where("id", attemptId).update({
        score,
        total
      });

      res.json({
        message: "Quiz submitted successfully",
        score,
        total
      });

    } catch (err) {
      console.error("SUBMIT QUIZ ERROR:", err);
      res.status(500).json({ message: "Quiz submission failed" });
    }
  },

  // 4) GET STUDENT'S OWN RESULTS
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
  },

  // 5) LEADERBOARD FOR A QUIZ
  async getLeaderboard(req, res) {
    try {
      const quizId = req.params.id;

      const leaderboard = await db("attempts")
        .join("users", "attempts.student_id", "users.id")
        .select(
          "users.name",
          "attempts.score",
          "attempts.total",
          "attempts.time_taken",
          "attempts.created_at"
        )
        .where("attempts.quiz_id", quizId)
        .orderBy("attempts.score", "desc")
        .orderBy("attempts.time_taken", "asc");

      res.json({ leaderboard });

    } catch (err) {
      console.error("LEADERBOARD ERROR:", err);
      res.status(500).json({ message: "Could not load leaderboard" });
    }
  }

};
