import { Router } from 'express';
import { catchAsync } from '../usecases/error';
import GameController from '../controllers/GameController';

const router = Router();

router.post('/start/:contestId', catchAsync(GameController.start));

router.get('/:id', catchAsync(GameController.getPair));

router.post('/:id', catchAsync(GameController.choose));

export default router;
