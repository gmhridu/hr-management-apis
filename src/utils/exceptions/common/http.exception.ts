import { env } from '@/config/env';

export class HttpException extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      ...(this.details && { details: this.details }),
      ...(env.nodeEnv === 'development' && { stack: this.stack }),
    };
  }
}
