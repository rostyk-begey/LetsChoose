import { NextFunction, Response } from 'express';

import { ContestModel } from '../models/Contest';
import { AppError } from '../usecases/error';
import { RequestWithUserId } from '../types';

export default async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    userId,
    params: { id },
  } = req;
  const contest = await ContestModel.findById(id);
  if (!contest) throw new AppError('Resource not found', 404);
  if (contest.author?.toString() === userId?.toString()) {
    next();
  } else {
    throw new AppError('User has no permission to proceed request', 401);
  }
};
