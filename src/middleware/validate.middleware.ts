import type { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import Joi from 'joi';

export class ValidationMiddleware {
  // Validate request body
  static validateBody(schema: Joi.ObjectSchema) {
    return (req: Request, _res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return next(error);
      }

      Object.keys(req.body).forEach((key) => delete (req.body as any)[key]);
      Object.assign(req.body, value);

      next();
    };
  }

  // Validate request query
  static validateQuery(schema: Joi.ObjectSchema) {
    return (req: Request, _res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return next(error);
      }

      Object.keys(req.query).forEach((key) => delete (req.query as any)[key]);
      Object.assign(req.query, value);

      next();
    };
  }

  // Validate request params
  static validateParams(schema: Joi.ObjectSchema) {
    return (req: Request, _res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return next(error);
      }

      Object.keys(req.params).forEach((key) => delete (req.params as any)[key]);
      Object.assign(req.params, value);

      next();
    };
  }
}
