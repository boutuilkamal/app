import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../database/prisma';
import { config } from '../../config';
import { AppError } from '../../utils/errorHandler';
import { UserRole } from '@prisma/client';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterData) {
    const { email, password, firstName, lastName, role = UserRole.CLIENT } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      },
    });

    if (role === UserRole.CLIENT) {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
        },
      });
    } else if (role === UserRole.COACH) {
      await prisma.coachProfile.create({
        data: {
          userId: user.id,
        },
      });
    }

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  async login(data: LoginData) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        clientProfile: true,
        coachProfile: true,
      },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is inactive', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        clientProfile: user.clientProfile,
        coachProfile: user.coachProfile,
      },
      token,
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as {
        userId: string;
        role: UserRole;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        throw new AppError('Invalid token', 401);
      }

      return user;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }

  private generateToken(userId: string, role: UserRole): string {
    return jwt.sign({ userId, role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
