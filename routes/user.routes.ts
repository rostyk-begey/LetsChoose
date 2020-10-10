import { Router, Request, Response, NextFunction } from 'express';

import auth from '../middleware/auth.middleware';
import { catchAsync } from '../usecases/error';
import UserController from '../controllers/user/UserController';

const router = Router();

router.get(
  '/me',
  auth,
  (req: Request, res: Response, next: NextFunction): void => {
    req.params.username = 'me';
    next();
  },
  catchAsync(UserController.find),
);

router.get('/:username', catchAsync(UserController.find));

router.delete('/:username', auth, catchAsync(UserController.remove));

export default router;