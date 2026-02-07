import jwt from 'jsonwebtoken';
import status from 'http-status';
import { env } from '@/config/env';
import { NotFoundException } from '@/utils/exceptions/exception';
import type { NextFunction, Request, Response } from 'express';
import type { DecodeToken } from '@/types/express';

export class AuthMiddleware {
  // verify jwt token from authorization header
  static authenticate() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Get token from authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
          res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Authorization header is missing',
          });
          return;
        }

        // Check if token starts with "Bearer "
        if (!authHeader.startsWith('Bearer ')) {
          res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid token format',
          });
          return;
        }

        // Extract token from header
        const token = authHeader.substring(7);

        if (!token) {
          res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Token is missing',
          });
          return;
        }

        // verify token
        const jwtSecret = env.jwtSecret;

        if (!jwtSecret) {
          throw new NotFoundException('JWT_SECRET is not defined in environment variables');
        }

        const decoded = jwt.verify(token, jwtSecret) as DecodeToken;

        // attach user info to request
        req.user = {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
        };

        next();
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid token',
          });
          return;
        }

        if (error instanceof jwt.TokenExpiredError) {
          res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Token expired',
          });
          return;
        }

        if (error instanceof jwt.TokenExpiredError) {
          res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Token expired',
          });
          return;
        }

        res.status(status.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal server error',
        });
      }
    };
  }
}
