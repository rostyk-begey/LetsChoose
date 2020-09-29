const { Router } = require('express');
const { catchAsync } = require('../usecases/error');
const GameController = require('../controllers/GameController');

const router = Router();

router.post('/start/:contestId', catchAsync(GameController.start));

router.get('/:id', catchAsync(GameController.getPair));

router.post('/:id', catchAsync(GameController.choose));

module.exports = router;
