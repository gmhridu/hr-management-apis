import { AuthService } from '@/services/auth.service';
import type { Request, Response } from 'express';
import status from 'http-status';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * login HR user
   * POST /auth/login
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login({ email, password });

      res.status(status.OK).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login Failed';

      res.status(status.UNAUTHORIZED).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  /**
   * register HR user
   * POST /auth/register
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      const result = await this.authService.register({ email, password, name });

      res.status(status.CREATED).json({
        success: true,
        message: 'Registration successful',
        data: result,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration Failed';

      res.status(status.BAD_REQUEST).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  /**
   * Get current user
   * GET /auth/me
   */

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(status.UNAUTHORIZED).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const user = await this.authService.verifyUser(req.user.id);

      if (!user) {
        res.status(status.NOT_FOUND).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(status.OK).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to retrieve user profile';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  /**
   * Change user password
   * POST /auth/change-password
   */
  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(status.UNAUTHORIZED).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { oldPassword, newPassword } = req.body;

      const result = await this.authService.changePassword(req.user.id, oldPassword, newPassword);

      if (result) {
        res.status(status.OK).json({
          success: true,
          message: 'Password changed successfully',
        });
      } else {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: 'Failed to change password',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';

      res.status(status.BAD_REQUEST).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  /**
   * Refresh JWT token
   * POST /auth/refresh
   */

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(status.UNAUTHORIZED).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const token = await this.authService.refreshToken(req.user.id);

      res.status(status.OK).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh token';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.authService.logout();

      res.status(status.OK).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to logout';

      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }
  };
}
