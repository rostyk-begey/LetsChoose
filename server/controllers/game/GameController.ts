import { Request } from 'express';
import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  requestParam,
  results,
} from 'inversify-express-utils';

import { ContestItem } from '../../models/ContestItem';
import { GetPairParams } from './types';
import { IGameService } from '../../services/GameService';
import {
  getGameSchema,
  playGameSchema,
  startGameSchema,
} from '../../schema/game';
import { TYPES } from '../../inversify.types';

@controller('/api/games')
export default class GameController extends BaseHttpController {
  constructor(
    @inject(TYPES.GameService)
    protected readonly gameService: IGameService,
  ) {
    super();
  }

  @httpPost('/start/:contestId', ...startGameSchema)
  public async start(
    @requestParam('contestId') contestId: string,
  ): Promise<results.JsonResult> {
    const game = await this.gameService.start(contestId);

    return this.json(
      {
        contestId: game.contestId as string,
        gameId: game.id,
        message: 'Game was successfully created',
      },
      201,
    );
  }

  @httpGet('/:gameId', ...getGameSchema)
  public async get(
    @requestParam('gameId') gameId: string,
  ): Promise<results.JsonResult> {
    const game = await this.gameService.findGameById(gameId);

    return this.json(
      {
        round: game.round,
        totalRounds: game.totalRounds,
        contestId: game.contestId as string,
        finished: game.finished,
        pair: game.pair as ContestItem[],
      },
      200,
    );
  }

  @httpPost('/:gameId', ...playGameSchema)
  public async play(
    req: Request<GetPairParams, any, { winnerId: string }>,
  ): Promise<results.JsonResult> {
    await this.gameService.playRound(req.params.gameId, req.body.winnerId);
    const game = await this.gameService.findGameById(req.params.gameId);

    return this.json(
      {
        round: game.round,
        totalRounds: game.totalRounds,
        contestId: game.contestId as string,
        finished: game.finished,
        pair: game.pair as ContestItem[],
      },
      200,
    );
  }
}
