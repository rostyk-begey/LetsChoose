const { Router } = require('express');
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth.middleware');
const { catchAsync } = require('../usecases/error');
const loginSchema = require('../middleware/auth/loginSchema.middleware');
const registerSchema = require('../middleware/auth/registerSchema.middleware');
const forgotPasswordSchema = require('../middleware/auth/forgotPasswordSchema.middleware');
const resetPasswordSchema = require('../middleware/auth/resetPasswordSchema.middleware');

const router = Router();

router.post('/', auth, async (req, res) => {
  res.status(200).json({});
});

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

router.post('/refresh_token', catchAsync(UserController.refreshToken));

module.exports = router;
