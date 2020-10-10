import { Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public data: object;

  constructor(message: string, statusCode: number, data = {}) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (err: AppError, res: Response): void => {
  err.statusCode = err.statusCode || 500;
  let response = {
    statusCode: err.statusCode,
    status: err.status || 'error',
  };
  if (err.isOperational) {
    // @ts-ignore
    response.message = err.message;
  }
  if (err.data !== {}) {
    response = {
      ...response,
      ...err.data,
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(err);
  }

  res.status(err.statusCode).json(response);
};

interface func<T, R> {
  (req: T, res: Response, next: NextFunction): R;
}

export const catchAsync = (fn: func<any, Promise<void>>): func<any, void> => (req, res, next) => {
  fn(req, res, next).catch(next);
};