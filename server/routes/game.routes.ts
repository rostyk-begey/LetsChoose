import { Router } from 'express';

import { catchAsync } from '../usecases/error';
import GameController from '../controllers/game/GameController';
import { startGameSchema, getGameSchema, playGameSchema } from '../schema/game';
import container from '../container';

const router = Router();

const gameController = container.get<GameController>(GameController);

router.post(
  '/start/:contestId',
  startGameSchema,
  catchAsync(gameController.start),
);

router.get('/:gameId', getGameSchema, catchAsync(gameController.get));

router.post('/:gameId', playGameSchema, catchAsync(gameController.play));

export default router;
