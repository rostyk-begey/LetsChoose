const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const { catchAsync } = require('../usecases/error');
const UserController = require('../controllers/UserController');

const router = Router();

router.get(
  '/me',
  auth,
  (req, res, next) => {
    req.params.username = 'me';
    next();
  },
  catchAsync(UserController.find),
);

router.get('/:username', catchAsync(UserController.find));

router.delete('/:username', auth, catchAsync(UserController.remove));

module.exports = router;
