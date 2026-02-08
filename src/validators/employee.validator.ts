import Joi from 'joi';

export class EmployeeValidator {
  // create employee
  static create = Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 255 characters',
      'string.empty': 'Name is required',
      'any.required': 'Name is required',
    }),
    age: Joi.number().integer().min(18).max(100).required().messages({
      'number.base': 'Age must be a number',
      'number.integer': 'Age must be an integer',
      'number.min': 'Age must be at least 18',
      'number.max': 'Age must not exceed 100',
      'any.required': 'Age is required',
    }),

    designation: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Designation must be at least 2 characters long',
      'string.max': 'Designation must not exceed 255 characters',
      'string.empty': 'Designation is required',
      'any.required': 'Designation is required',
    }),
    hiring_date: Joi.date().iso().required().messages({
      'date.base': 'Hiring date must be a valid date',
      'date.format': 'Hiring date must be in ISO format (YYYY-MM-DD)',
      'any.required': 'Hiring date is required',
    }),
    date_of_birth: Joi.date().iso().max('now').required().messages({
      'date.base': 'Date of birth must be a valid date',
      'date.format': 'Date of birth must be in ISO format (YYYY-MM-DD)',
      'date.max': 'Date of birth must be in the past',
      'any.required': 'Date of birth is required',
    }),
    salary: Joi.number().positive().precision(2).required().messages({
      'number.base': 'Salary must be a number',
      'number.positive': 'Salary must be a positive number',
      'number.precision': 'Salary must have at most 2 decimal places',
      'any.required': 'Salary is required',
    }),
    photo_path: Joi.string().max(500).optional().allow(null, '').messages({
      'string.max': 'Photo path must not exceed 500 characters',
    }),
  });

  // update employee
  static update = Joi.object({
    name: Joi.string().min(2).max(255).optional().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 255 characters',
    }),
    age: Joi.number().integer().min(18).max(100).optional().messages({
      'number.base': 'Age must be a number',
      'number.integer': 'Age must be an integer',
      'number.min': 'Age must be at least 18',
      'number.max': 'Age must not exceed 100',
    }),
    designation: Joi.string().min(2).max(255).optional().messages({
      'string.min': 'Designation must be at least 2 characters long',
      'string.max': 'Designation must not exceed 255 characters',
    }),
    hiring_date: Joi.date().iso().optional().messages({
      'date.base': 'Hiring date must be a valid date',
      'date.format': 'Hiring date must be in ISO format (YYYY-MM-DD)',
    }),
    date_of_birth: Joi.date().iso().max('now').optional().messages({
      'date.base': 'Date of birth must be a valid date',
      'date.format': 'Date of birth must be in ISO format (YYYY-MM-DD)',
      'date.max': 'Date of birth must be in the past',
    }),
    salary: Joi.number().positive().precision(2).optional().messages({
      'number.base': 'Salary must be a number',
      'number.positive': 'Salary must be a positive number',
      'number.precision': 'Salary must have at most 2 decimal places',
    }),
    photo_path: Joi.string().max(500).optional().allow(null, '').messages({
      'string.max': 'Photo path must not exceed 500 characters',
    }),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided for update',
    });

  // employee query filters
  static query = Joi.object({
    search: Joi.string().max(255).optional().allow('').messages({
      'string.max': 'Search query must not exceed 255 characters',
    }),
    page: Joi.number().integer().min(1).optional().default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
    }),
    limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100',
    }),
  });

  // employee id parameters
  static id = Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.base': 'Employee ID must be a string',
      'string.guid': 'Employee ID must be a valid UUID',
      'any.required': 'Employee ID is required',
    }),
  });
}
