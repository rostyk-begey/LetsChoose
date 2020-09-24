const { Router } = require('express');
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth.middleware');
const { catchAsync } = require('../usecases/error');
const registerSchema = require('../middleware/auth/registerSchema.middleware');
const loginSchema = require('../middleware/auth/loginSchema.middleware');

const router = Router();

router.post('/', auth, async (req, res) => {
  res.status(200).json({});
});

router.post('/register', registerSchema, catchAsync(UserController.register));

router.post('/login', loginSchema, catchAsync(UserController.login));

router.post(
  '/refresh_token',
  loginSchema,
  catchAsync(UserController.refreshToken),
);

module.exports = router;
