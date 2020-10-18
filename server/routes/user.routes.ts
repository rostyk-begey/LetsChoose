import { Router, Request, Response, NextFunction } from 'express';

import auth from '../middleware/auth.middleware';
import { catchAsync } from '../usecases/error';
import UserController from '../controllers/user/UserController';
import container from '../container';

const router = Router();

const userController = container.get<UserController>(UserController);

router.get(
  '/me',
  auth,
  (req: Request, res: Response, next: NextFunction): void => {
    req.params.username = 'me';
    next();
  },
  catchAsync(userController.find),
);

router.get('/:username', catchAsync(userController.find));

router.delete('/:username', auth, catchAsync(userController.remove));

export default router;
