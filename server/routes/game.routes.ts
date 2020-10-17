import { Router } from 'express';

import { catchAsync } from '../usecases/error';
import gameController from '../controllers/game/GameController';
import { startGameSchema, getGameSchema, playGameSchema } from '../schema/game';

const router = Router();

router.post(
  '/start/:contestId',
  startGameSchema,
  catchAsync(gameController.start),
);

router.get('/:gameId', getGameSchema, catchAsync(gameController.get));

router.post('/:gameId', playGameSchema, catchAsync(gameController.play));

export default router;
