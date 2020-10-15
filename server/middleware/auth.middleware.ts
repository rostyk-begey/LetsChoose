import { NextFunction, RequestHandler, Response } from 'express';

import { AppError } from '../usecases/error';
import JwtService from '../services/JwtService';
import { RequestWithUserId } from '../types';

const auth = (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction,
): void => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers?.authorization?.split(' ')[1] as string;
    const { userId } = JwtService.verifyAccessToken(token);
    req.userId = userId;
    next();
  } catch (e) {
    throw new AppError('Unauthorized', 401);
  }
};

export default auth as RequestHandler;
