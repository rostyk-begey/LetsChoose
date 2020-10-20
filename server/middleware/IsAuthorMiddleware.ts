import express from 'express';
import { inject, injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

import { AppError } from '../usecases/error';
import { RequestWithUserId } from '../types';
import { IContestRepository } from '../repositories/ContestRepository';
import { TYPES } from '../inversify.types';

@injectable()
export default class IsAuthorMiddleware extends BaseMiddleware {
  @inject(TYPES.ContestRepository) // @ts-ignore
  private readonly contestRepository: IContestRepository;

  public async handler(
    req: RequestWithUserId,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const {
      userId,
      params: { id },
    } = req;
    const contest = await this.contestRepository.findById(id);

    if (contest.author?.toString() !== userId?.toString()) {
      next(new AppError('User has no permission to proceed request', 401));
    } else {
      next();
    }
  }
}
