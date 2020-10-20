import { NextFunction, Response } from 'express';

import { AppError } from '../usecases/error';
import { RequestWithUserId } from '../types';
import ContestRepository from '../repositories/ContestRepository';

export default async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    userId,
    params: { id },
  } = req;
  const contest = await new ContestRepository().findById(id);

  if (contest.author?.toString() !== userId?.toString()) {
    throw new AppError('User has no permission to proceed request', 401);
  } else {
    next();
  }
};

// @injectable()
// export class IsAuthorMiddleware implements IMiddleware {
//   constructor(
//     @inject(ContestRepository)
//     protected readonly contestRepository: IContestRepository,
//   ) {}
//
//   public async handle(
//     req: Request,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> {
//     const {
//       // @ts-ignore
//       userId,
//       params: { id },
//     } = req;
//
//     const contest = await this.contestRepository.findById(id);
//
//     if (contest.author?.toString() !== userId?.toString()) {
//       throw new AppError('User has no permission to proceed request', 401);
//     }
//
//     next();
//   }
// }
