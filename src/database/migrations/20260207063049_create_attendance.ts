export async function up(knex) {
  return knex.schema.createTable("attendance", (table) => {
    table.increments("id").primary();
    table
      .integer("employee_id")
      .references("id")
      .inTable("employees")
      .onDelete("CASCADE");

    table.date("date").notNullable();
    table.time("check_in_time").notNullable();

    table.unique(["employee_id", "date"]);
  });
}

export async function down(knex) {
  return knex.schema.dropTable("attendance");
}
