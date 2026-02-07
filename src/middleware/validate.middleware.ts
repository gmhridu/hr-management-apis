import type { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import Joi from 'joi';

export class ValidationMiddleware {
  // Validate request body
  static validateBody(schema: Joi.ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const validated = await schema.validateAsync(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });
        req.body = validated;
        next();
      } catch (error) {
        if (error instanceof Joi.ValidationError) {
          const errors = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
          }));
          res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Validation failed',
            errors,
          });
          return;
        }
        next(error);
      }
    };
  }

  // validate request query parameters
  static validateQuery(schema: Joi.ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const validated = await schema.validateAsync(req.query, {
          abortEarly: false,
          stripUnknown: true,
        });

        req.query = validated;
        next();
      } catch (error) {
        if (error instanceof Joi.ValidationError) {
          const errors = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
          }));
          res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Validation failed',
            errors,
          });
          return;
        }
        next(error);
      }
    };
  }

  // validate request params
  static validateParams(schema: Joi.ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const validated = await schema.validateAsync(req.params, {
          abortEarly: false,
          stripUnknown: true,
        });

        req.params = validated;
        next();
      } catch (error) {
        if (error instanceof Joi.ValidationError) {
          const errors = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
          }));
          res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Validation failed',
            errors,
          });
          return;
        }
        next(error);
      }
    };
  }
}
