import { Router } from 'express';

import { catchAsync } from '../usecases/error';
import GameController from '../controllers/game/GameController';
import { startGameSchema, getGameSchema, playGameSchema } from '../schema/game';

const router = Router();

router.post(
  '/start/:contestId',
  startGameSchema,
  catchAsync(GameController.start),
);

router.get('/:gameId', getGameSchema, catchAsync(GameController.get));

router.post('/:gameId', playGameSchema, catchAsync(GameController.play));

export default router;
