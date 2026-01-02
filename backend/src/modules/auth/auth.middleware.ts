import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/errorHandler';
import { AuthService } from './auth.service';
import { UserRole } from '@prisma/client';

const authService = new AuthService();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Not authorized to access this route', 401);
    }

    const user = await authService.validateToken(token);
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden - insufficient permissions', 403));
    }

    next();
  };
};
