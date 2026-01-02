import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../utils/errorHandler';
import { AuthRequest } from './auth.middleware';

const authService = new AuthService();

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  });

  login = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await authService.login(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  });

  getMe = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  });

  changePassword = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user!.id, oldPassword, newPassword);
    res.status(200).json({
      success: true,
      data: result,
    });
  });
}
