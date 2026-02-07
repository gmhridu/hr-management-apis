import { AuthController } from '@/controllers/auth.controller';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import { ErrorHandler } from '@/middleware/errors/error.middleware';
import { ValidationMiddleware } from '@/middleware/validate.middleware';
import { AuthValidator } from '@/validators/auth.validator';
import { Router } from 'express';

const router = Router();
const authController = new AuthController();

/**
 * @route POST /auth/register
 * @desc Register HR User
 * @access Public
 */

router.post(
  '/register',
  ValidationMiddleware.validateBody(AuthValidator.register),
  ErrorHandler.asyncHandler(authController.register)
);

/**
 * @route POST /auth/login
 * @desc Login HR User
 * @access Public
 */

router.post(
  '/login',
  ValidationMiddleware.validateBody(AuthValidator.login),
  ErrorHandler.asyncHandler(authController.login)
);

/**
 * @route   GET /auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  AuthMiddleware.authenticate(),
  ErrorHandler.asyncHandler(authController.getProfile)
);

/**
 * @route   PUT /auth/change-password
 * @desc    Change password
 * @access  Private
 */

router.put(
  '/change-password',
  AuthMiddleware.authenticate(),
  ValidationMiddleware.validateBody(AuthValidator.changePassword),
  ErrorHandler.asyncHandler(authController.changePassword)
);

/**
 * @route   POST /auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */

router.post(
  '/refresh',
  AuthMiddleware.authenticate(),
  ErrorHandler.asyncHandler(authController.refreshToken)
);

/**
 * @route   POST /auth/logout
 * @desc    Logout user
 * @access  Private
 */

router.post(
  '/logout',
  AuthMiddleware.authenticate(),
  ErrorHandler.asyncHandler(authController.logout)
);

export const authRoutes = router;
