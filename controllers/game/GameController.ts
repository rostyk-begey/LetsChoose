import { Request, Response } from 'express';

import { ContestItem } from '../../models/ContestItem';
import {
  GetPairParams,
  GetPairResponse,
  StartParams,
  StartResponse,
} from './types';
import GameService from '../../services/GameService';

export default class GameController {
  public static async start(
    req: Request<StartParams>,
    res: Response,
  ): Promise<void> {
    const game = await GameService.start(req.params.contestId);

    res.status(201).json({
      contestId: game.contestId as string,
      gameId: game._id,
      message: 'Game was successfully created',
    });
  }

  public static async get(
    req: Request<GetPairParams>,
    res: Response<GetPairResponse>,
  ): Promise<void> {
    const game = await GameService.findGameById(req.params.gameId);

    res.status(200).json({
      round: game.round,
      totalRounds: game.totalRounds,
      contestId: game.contestId as string,
      finished: game.finished,
      pair: game.pair as ContestItem[],
    });
  }

  public static async play(
    req: Request,
    res: Response<GetPairResponse>,
  ): Promise<void> {
    await GameService.playRound(req.params.id, req.body.winnerId);
    const game = await GameService.findGameById(req.params.id);

    res.status(200).json({
      round: game.round,
      totalRounds: game.totalRounds,
      contestId: game.contestId as string,
      finished: game.finished,
      pair: game.pair as ContestItem[],
    });
  }
}
