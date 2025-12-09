exports.up = function(knex) {
  return knex.schema.createTable("questions", function(table) {
    table.increments("id").primary();
    table.integer("quiz_id").unsigned().references("id").inTable("quizzes").onDelete("CASCADE");
    table.text("question_text").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("questions");
};
