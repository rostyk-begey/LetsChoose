const { Router } = require('express');
const { check } = require('express-validator');
const validator = require('validator');
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth.middleware');
const { catchAsync } = require('../usecases/error');
const registerSchema = require('../middleware/auth/registerSchema.middleware');

const router = Router();

router.post('/', auth, async (req, res) => {
  res.status(200).json({});
});

router.post('/register', registerSchema, catchAsync(UserController.register));

router.post(
  '/login',
  [
    check('login')
      .not()
      .isEmpty()
      .isString()
      .custom((value) => {
        if (validator.isEmail(value) || value.match(/^[a-zA-Z._0-9]+$/)) {
          return true;
        }
        throw new Error('Invalid login');
      }),
    check('password', 'Enter password').exists(),
  ],
  catchAsync(UserController.login),
);

module.exports = router;
