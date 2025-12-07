const db = require("../config/db");

const QuestionModel = {
  async create(question) {
    const [id] = await db("questions").insert(question);
    return id;
  },

  async findByTeacher(teacherId) {
    return db("questions").where({ teacher_id: teacherId }).orderBy("created_at", "desc");
  },

  async findById(id) {
    return db("questions").where({ id }).first();
  },

  async update(id, patch) {
    return db("questions").where({ id }).update(patch);
  },

  async remove(id) {
    return db("questions").where({ id }).del();
  }
};

module.exports = QuestionModel;
