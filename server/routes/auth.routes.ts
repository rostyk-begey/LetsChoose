import { Router, Request, Response } from 'express';

import userController from '../controllers/user/UserController';
import auth from '../middleware/auth.middleware';
import { catchAsync } from '../usecases/error';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schema/auth';

const router = Router();

router.post(
  '/',
  auth,
  async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({});
  },
);

router.post('/email/confirm/:token', catchAsync(userController.confirmEmail));

router.post(
  '/password/forgot',
  forgotPasswordSchema,
  catchAsync(userController.forgotPassword),
);

router.post(
  '/password/reset/:token',
  resetPasswordSchema,
  catchAsync(userController.resetPassword),
);

router.post('/register', registerSchema, catchAsync(userController.register));

router.post('/login', loginSchema, catchAsync(userController.login));

router.post('/token', catchAsync(userController.refreshToken));

export default router;
