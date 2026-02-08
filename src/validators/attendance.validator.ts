import Joi from 'joi';

export class AttendanceValidator {
  /**
   * Validate attendance creation/upsert request
   */
  static create = Joi.object({
    employee_id: Joi.string().uuid().required().messages({
      'string.base': 'Employee ID must be a string',
      'string.empty': 'Employee ID is required',
      'any.required': 'Employee ID is required',
    }),
    date: Joi.date().iso().required().messages({
      'date.base': 'Date must be a valid date',
      'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
      'any.required': 'Date is required',
    }),
    check_in_time: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
      .required()
      .messages({
        'string.pattern.base': 'Check-in time must be in HH:MM:SS format',
        'string.empty': 'Check-in time is required',
        'any.required': 'Check-in time is required',
      }),
  });

  /**
   * Validate attendance update request
   */
  static update = Joi.object({
    check_in_time: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
      .required()
      .messages({
        'string.pattern.base': 'Check-in time must be in HH:MM:SS format',
        'string.empty': 'Check-in time is required',
        'any.required': 'Check-in time is required',
      }),
  });

  /**
   * Validate attendance query filters
   */
  static query = Joi.object({
    employee_id: Joi.string().uuid().optional().messages({
      'string.guid': 'Employee ID must be a valid UUID',
    }),

    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),

    from: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),

    to: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),

    page: Joi.number().integer().min(1).optional(),

    limit: Joi.number().integer().min(1).max(100).optional(),
  });

  /**
   * Validate monthly report query
   */
  static monthlyReport = Joi.object({
    month: Joi.string()
      .pattern(/^\d{4}-\d{2}$/)
      .required()
      .messages({
        'string.pattern.base': 'Month must be in YYYY-MM format',
        'string.empty': 'Month is required',
        'any.required': 'Month is required',
      }),
    employee_id: Joi.string().uuid().required().messages({
      'string.base': 'Employee ID must be a string',
      'string.empty': 'Employee ID is required',
      'any.required': 'Employee ID is required',
    }),
  });

  /**
   * Validate attendance ID parameter
   */
  static id = Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.base': 'ID must be a string',
      'string.empty': 'ID is required',
      'any.required': 'ID is required',
    }),
  });
}
