import { NextFunction, Request, Response } from 'express';

import Contest from '../models/Contest';
import { AppError } from '../usecases/error';

export default async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    // @ts-ignore
    userId,
    params: { id },
  } = req;
  const contest = await Contest.findById(id);
  if (!contest) throw new AppError('Resource not found', 404);
  if (contest.author.toString() === userId.toString()) {
    next();
  } else {
    throw new AppError('User has no permission to proceed request', 401);
  }
};
