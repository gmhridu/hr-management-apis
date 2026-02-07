import { env } from '@/config/env';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

export class JwtUtils {
  private static getSecret(): string {
    const secret = env.jwtSecret;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    return secret;
  }

  private static getExpiresIn(): string {
    return env.jwtExpiresIn || '24h';
  }

  // Convert expiresIn string to seconds
  private static parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 86400; // Default to 24 hours
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 86400;
    }
  }

  // Generate Jwt Token
  static generateToken(payload: JwtPayload): string {
    const expiresInSeconds = this.parseExpiresIn(this.getExpiresIn());
    return jwt.sign(payload, this.getSecret(), {
      expiresIn: expiresInSeconds,
    });
  }

  // Verify Jwt Token
  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.getSecret()) as JwtPayload;
  }

  // decode token
  static dedcodeToken(token: string): JwtPayload | null {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded as JwtPayload | null;
  }

  // Generate Token from user
  static generateTokenFromUser(user: { id: string; email: string; name: string }): string {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    return this.generateToken(payload);
  }

  // check if token expired
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as { exp?: number };

      if (!decoded || !decoded.exp) {
        return true;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Get token expiration time
  static getTokenExpration(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as { exp?: number };

      if (!decoded || !decoded.exp) {
        return null;
      }
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  }
}
