import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

export interface DecodeToken extends JwtPayload {
  id: string;
  email: string;
  name: string;
}
