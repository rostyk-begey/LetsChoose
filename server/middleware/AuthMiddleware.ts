import express from 'express';
import { inject, injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

import { AppError } from '../usecases/error';
import { IJwtService } from '../services/JwtService';
import { RequestWithUserId } from '../types';
import { TYPES } from '../inversify.types';

@injectable()
export default class AuthMiddleware extends BaseMiddleware {
  @inject(TYPES.JwtService) // @ts-ignore
  private readonly jwtService: IJwtService;

  public async handler(
    req: RequestWithUserId,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const token = req.headers.authorization?.split(' ')[1] as string;
      const { userId } = this.jwtService.verifyAccessToken(token);
      req.userId = userId;
      next();
    } catch (e) {
      console.log(e);
      next(new AppError('Unauthorized', 401));
    }
  }
}
