const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const { catchAsync } = require('../usecases/error');
const UserController = require('../controllers/UserController');

const router = Router();

router.get('/:username', auth, catchAsync(UserController.find));

router.delete('/:username', auth, catchAsync(UserController.remove));

module.exports = router;
