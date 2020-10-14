import { Router } from 'express';

import { catchAsync } from '../usecases/error';
import GameController from '../controllers/game/GameController';

const router = Router();

router.post('/start/:contestId', catchAsync(GameController.start));

router.get('/:id', catchAsync(GameController.get));

router.post('/:id', catchAsync(GameController.play));

export default router;
