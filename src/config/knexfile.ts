import { env } from '@/config/env';
import { Knex } from 'knex';

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
    directory: './src/database/migrations',
  },
};
