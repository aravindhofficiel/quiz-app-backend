exports.up = function (knex) {
  return knex.schema.createTable("scores", function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("quiz_id").unsigned().notNullable();
    table.integer("score").notNullable();
    table.timestamps(true, true);

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .foreign("quiz_id")
      .references("id")
      .inTable("quizzes")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("scores");
};
