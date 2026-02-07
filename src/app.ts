import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import type { Request, Response } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import { env } from '@/config/env';
import { ErrorHandler } from '@/middleware/errors/error.middleware';
import { authRoutes } from '@/routes/auth.route';

const app = express();

app.use(
  cors({
    origin: env.corsOrigin || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is running  🚀' });
});

// Routes
app.use('/api/auth', authRoutes);

// Global error handler
app.use(ErrorHandler.notFound);
app.use(ErrorHandler.handler);

export default app;
