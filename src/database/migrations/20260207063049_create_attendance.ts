import type { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('attendance', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('employee_id')
      .notNullable()
      .references('id')
      .inTable('employees')
      .onDelete('CASCADE');

    table.date('date').notNullable();
    table.time('check_in_time').notNullable();

    table.unique(['employee_id', 'date']);
    table.index(['employee_id']);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('attendance');
}
