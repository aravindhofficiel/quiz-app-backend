exports.up = function (knex) {
  return knex.schema.createTable("questions", function (table) {
    table.increments("id").primary();
    table.integer("quiz_id").unsigned().notNullable();
    table.text("question_text").notNullable();
    table.timestamps(true, true);

    table
      .foreign("quiz_id")
      .references("id")
      .inTable("quizzes")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("questions");
};
