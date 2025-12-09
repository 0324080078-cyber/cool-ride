import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  status: string;
  message: string;
  stack?: string;
  errors?: any;
}

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const response: ErrorResponse = {
    status: err.status,
    message: err.message,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    if (err.errors) {
      response.errors = err.errors;
    }
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    response.message = 'Validation error';
    response.errors = err.errors;
    err.statusCode = 400;
  }

  if (err.name === 'JsonWebTokenError') {
    response.message = 'Invalid token';
    err.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    response.message = 'Token expired';
    err.statusCode = 401;
  }

  if (err.code === '23505') { // PostgreSQL unique constraint
    response.message = 'Duplicate entry';
    err.statusCode = 409;
  }

  res.status(err.statusCode).json(response);
};
