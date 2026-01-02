import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.maxRequests;

  if (!store[ip] || now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return next();
  }

  store[ip].count++;

  if (store[ip].count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later.',
    });
  }

  next();
};
