exports.up = function(knex) {
  return knex.schema.createTable("quizzes", function(table) {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.integer("teacher_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("quizzes");
};
