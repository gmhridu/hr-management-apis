import Joi from 'joi';

export class AuthValidator {
  // Login Request
  static login = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
      'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
      'string.empty': 'Password is required',
    }),
  });

  // Register Request
  static register = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
      'string.empty': 'Email is required',
    }),
    password: Joi.string()
      .min(6)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'Password is required',
        'string.empty': 'Password is required',
      }),

    name: Joi.string().min(3).max(255).required().messages({
      'any.required': 'Name is required',
      'string.empty': 'Name is required',
    }),
  });

  // Change Password Request
  static changePassword = Joi.object({
    oldPassword: Joi.string().required().messages({
      'any.required': 'Old password is required',
      'string.empty': 'Old password is required',
    }),
    newPassword: Joi.string()
      .min(6)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'New password is required',
        'string.empty': 'New password is required',
      }),
  });
}
