const db = require("../config/db");

const QuizModel = {
  async create(quiz) {
    const [id] = await db("quizzes").insert(quiz);
    return id;
  },

  async addQuestion(quizQuestion) {
    const [id] = await db("quiz_questions").insert(quizQuestion);
    return id;
  },

  async getByTeacher(teacherId) {
    return db("quizzes").where({ teacher_id: teacherId }).orderBy("created_at", "desc");
  },

  async getQuizWithQuestions(quizId) {
    const quiz = await db("quizzes").where({ id: quizId }).first();
    const items = await db("quiz_questions").where({ quiz_id: quizId });
    return { quiz, items };
  },

  async remove(quizId) {
    await db("quiz_questions").where({ quiz_id: quizId }).del();
    return db("quizzes").where({ id: quizId }).del();
  }
};

module.exports = QuizModel;
