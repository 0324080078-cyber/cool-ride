import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import User from '../models/User';

interface JwtPayload {
  userId: string;
  userType: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: string;
      userType?: string;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as JwtPayload;

    // Get user from database
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    if (!user.isActive) {
      return next(new AppError('User account is deactivated', 401));
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;
    req.userType = user.userType;

    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userType) {
      return next(new AppError('Unauthorized', 403));
    }

    if (!roles.includes(req.userType)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
