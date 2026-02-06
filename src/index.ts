import { env } from '@/config/env';
import app from './app';
import { db } from './database';

const PORT = env.port;

// Test database connection before starting the server
db.raw('SELECT 1')
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });
