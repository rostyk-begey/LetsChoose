import jwt from 'jsonwebtoken';
import config from 'config';
import { NextFunction, Request, Response } from 'express';

import { AppError } from '../usecases/error';

export default (req: Request, res: Response, next: NextFunction): void => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers?.authorization?.split(' ')[1];
    // @ts-ignore
    const { userId } = jwt.verify(token, config.get('jwt.accessSecret'));
    // @ts-ignore
    req.userId = userId;
    next();
  } catch (e) {
    throw new AppError('Unauthorized', 401);
  }
};
