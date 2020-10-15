import { Router, Request, Response } from 'express';

import UserController from '../controllers/user/UserController';
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

router.post('/email/confirm/:token', catchAsync(UserController.confirmEmail));

router.post(
  '/password/forgot',
  forgotPasswordSchema,
  catchAsync(UserController.forgotPassword),
);

router.post(
  '/password/reset/:token',
  resetPasswordSchema,
  catchAsync(UserController.resetPassword),
);

router.post('/register', registerSchema, catchAsync(UserController.register));

router.post('/login', loginSchema, catchAsync(UserController.login));

router.post('/token', catchAsync(UserController.refreshToken));

export default router;
