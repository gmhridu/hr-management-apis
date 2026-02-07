require('dotenv').config();
const path = require('path');

const common = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.join(__dirname, 'src', 'database', 'migrations'),
    extension: 'ts',
  },
};

module.exports = {
  development: {
    ...common,
  },
  test: {
    ...common,
  },
  production: {
    ...common,
  },
};
