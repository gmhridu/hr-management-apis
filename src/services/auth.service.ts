import { env } from '@/config/env';
import { HrUserModel } from '@/models/hr-user.model';
import type { HrUser } from '@/types/models';
import { NotFoundException } from '@/utils/exceptions/exception';
import { JwtUtils } from '@/utils/jwt';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
  expiresIn: string;
}

export class AuthService {
  private hrUserModel: HrUserModel;

  constructor() {
    this.hrUserModel = new HrUserModel();
  }

  // Register a new HR
  async register(data: RegisterData): Promise<AuthResponse> {
    const { email, password, name } = data;

    // check if user already exists with this email
    const existingUser = await this.hrUserModel.findByEmail(email);

    if (existingUser) {
      throw new NotFoundException('User already exists with this email', {
        email: existingUser.email,
      });
    }

    // Hash password
    const passwordHash = await this.hrUserModel.hashPassword(password);

    // Create user
    const user = await this.hrUserModel.create({
      email,
      password_hash: passwordHash,
      name,
    });

    // Generate JWT token
    const token = JwtUtils.generateTokenFromUser({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },

      token,
      expiresIn: env.jwtExpiresIn || '24h',
    };
  }

  // Login HR user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await this.hrUserModel.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    // verify password
    const isPasswordValid = await this.hrUserModel.verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid email or password');
    }

    // Generate Jwt Token
    const token = JwtUtils.generateTokenFromUser({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
      expiresIn: env.jwtExpiresIn || '24h',
    };
  }

  // Verify user by ID
  async verifyUser(userId: string): Promise<Omit<HrUser, 'password_hash'> | undefined> {
    return this.hrUserModel.findByIdSafe(userId);
  }

  // Change user password
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    // get user with password hash
    const user = await this.hrUserModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    // verify old password
    const isPasswordValid = await this.hrUserModel.verifyPassword(oldPassword, user.password_hash);

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid old password!');
    }

    // update password
    return await this.hrUserModel.updatePassword(userId, newPassword);
  }

  // refresh token
  async refreshToken(userId: string): Promise<string> {
    const user = await this.hrUserModel.findByIdSafe(userId);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return JwtUtils.generateTokenFromUser({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }

  async logout(): Promise<void> {
    return;
  }
}
