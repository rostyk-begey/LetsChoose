import { Request, Response } from 'express';
import autobind from 'autobind-decorator';
import { inject, injectable } from 'inversify';

import { ContestItem } from '../../models/ContestItem';
import { GetPairParams, GetPairResponse, StartParams } from './types';
import GameService, { IGameService } from '../../services/GameService';

@autobind
@injectable()
export default class GameController {
  private readonly gameService: IGameService;

  constructor(
    @inject(GameService)
    gameService: IGameService,
  ) {
    this.gameService = gameService;
  }

  public async start(req: Request<StartParams>, res: Response): Promise<void> {
    const game = await this.gameService.start(req.params.contestId);

    res.status(201).json({
      contestId: game.contestId as string,
      gameId: game.id,
      message: 'Game was successfully created',
    });
  }

  public async get(
    req: Request<GetPairParams>,
    res: Response<GetPairResponse>,
  ): Promise<void> {
    const game = await this.gameService.findGameById(req.params.gameId);

    res.status(200).json({
      round: game.round,
      totalRounds: game.totalRounds,
      contestId: game.contestId as string,
      finished: game.finished,
      pair: game.pair as ContestItem[],
    });
  }

  public async play(
    req: Request<GetPairParams>,
    res: Response<GetPairResponse>,
  ): Promise<void> {
    await this.gameService.playRound(req.params.gameId, req.body.winnerId);
    const game = await this.gameService.findGameById(req.params.gameId);

    res.status(200).json({
      round: game.round,
      totalRounds: game.totalRounds,
      contestId: game.contestId as string,
      finished: game.finished,
      pair: game.pair as ContestItem[],
    });
  }
}
