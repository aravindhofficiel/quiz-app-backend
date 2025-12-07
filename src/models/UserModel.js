const db = require("../config/db");

const UserModel = {
  async createUser(data) {
    const [id] = await db("users").insert(data);
    return id;
  },

  async findByEmail(email) {
    return db("users").where({ email }).first();
  }
};

module.exports = UserModel;
