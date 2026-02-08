import { env } from '@/config/env';
import { ErrorHandler } from '@/middleware/errors/error.middleware';
import { authRoutes } from '@/routes/auth.route';
import { employeeRoutes } from '@/routes/employee.route';
import compression from 'compression';
import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

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

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'API is running  🚀' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Global error handler
app.use(ErrorHandler.notFound);
app.use(ErrorHandler.handler);

export default app;
