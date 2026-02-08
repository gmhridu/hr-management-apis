import { env } from '@/config/env';
import { MulterError } from 'multer';
import type { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/utils/exceptions/common/http.exception';

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
  details?: any;
  stack?: string;
  timestamp: string;
}

export class ErrorHandler {
  static handler(err: unknown, req: Request, res: Response, next: NextFunction): void {
    console.error(`[${req.method} ${req.originalUrl}]`, err);

    const isDev = env.nodeEnv === 'development';
    let status = 500;
    let message = 'Internal Server Error';
    let details: any = undefined;

    // Custom Http Exception
    if (err instanceof HttpException) {
      status = err.status;
      message = err.message;
      details = err.details;
    }
    // Multer errors
    else if (err instanceof MulterError) {
      status = 400;
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          message = 'File size exceeds the maximum allowed limit';
          break;
        case 'LIMIT_FILE_COUNT':
          message = 'Too many files uploaded';
          break;
        case 'LIMIT_UNEXPECTED_FILE':
          message = 'Unexpected field name in file upload';
          break;
        default:
          message = 'Invalid file upload';
      }
      details = { code: err.code, field: err.field };
    }

    // common database errors
    else if (err instanceof Error) {
      const msg = err.message?.toLowerCase() || '';

      if (
        msg.includes('duplicate key') ||
        msg.includes('unique constraint') ||
        msg.includes('duplicate entry')
      ) {
        status = 409;
        message = 'Resources already exists';
        details = { conflict: 'duplicate key' };
      } else if (msg.includes('foreign key') || msg.includes('constraint fails')) {
        status = 400;
        message = 'Invalid reference to related entity';
        details = { issue: 'foreign key violation' };
      } else if (msg.includes('validation failed') || msg.includes('validator')) {
        status = 400;
        message = 'Validation error';
        details = err.message;
      }
    }

    // Fallback - unknown error

    if (status === 500) {
      message = isDev ? (err as Error)?.message || message : 'Something went wrong';
      details = isDev ? (err as Error)?.message : undefined;
    }

    const response: ErrorResponse = {
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      ...(details && { details }),
      ...(isDev && { error: (err as Error)?.message, stack: (err as Error)?.stack }),
    };

    res.status(status).json(response);
  }

  // not found
  static notFound(req: Request, res: Response, next: NextFunction): void {
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: `Cannot ${req.method} ${req.originalUrl}`,
      timestamp: new Date().toISOString(),
    });
  }

  static asyncHandler<T>(fn: (req: Request, res: Response, next: NextFunction) => Promise<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
