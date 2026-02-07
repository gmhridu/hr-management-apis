import { Knex } from 'knex';
import { env } from './env';

export const config: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: env.databaseUrl,
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: '../database/migrations',
  },
  seeds: {
    directory: '../database/seeds',
  },
};
