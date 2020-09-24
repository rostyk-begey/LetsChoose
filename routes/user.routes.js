const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const { catchAsync } = require('../usecases/error');
const UserController = require('../controllers/UserController');

const router = Router();

router.get(
  '/me',
  auth,
  (req, res, next) => {
    req.params.id = req.userId;
    next();
  },
  catchAsync(UserController.find),
);

router.get('/:id', auth, catchAsync(UserController.find));

router.delete('/:id', auth, catchAsync(UserController.remove));

module.exports = router;
