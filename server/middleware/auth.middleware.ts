import { NextFunction, RequestHandler, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

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
    const { userId } = new JwtService().verifyAccessToken(token);
    req.userId = userId;
    next();
  } catch (e) {
    throw new AppError('Unauthorized', 401);
  }
};

// export class AuthMiddleware implements IMiddleware {
//   constructor(
//     @inject(JwtService)
//     protected readonly jwtService: IJwtService,
//   ) {}
//
//   handle(req: Request, res: Response, next: NextFunction): void {
//     if (req.method === 'OPTIONS') {
//       next();
//     }
//
//     try {
//       const token = req.headers.authorization?.split(' ')[1] as string;
//       const { userId } = this.jwtService.verifyAccessToken(token);
//       // @ts-ignore
//       req.userId = userId;
//       next();
//     } catch (e) {
//       throw new AppError('Unauthorized', 401);
//     }
//   }
// }

export default auth as RequestHandler;
