import { GetPairResponse } from '@lets-choose/common';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';

import { TYPES } from '../../injectable.types';
import { IGameService } from '../../abstract/game.service.interface';
import { JoiValidationPipe } from '../../pipes/JoiValidationPipe';
import { ContestItem } from '../contest/contest-item.schema';
import { gamePlaySchema } from './game.validation';

@Controller('/api/games')
export class GameController {
  constructor(
    @Inject(TYPES.GameService)
    protected readonly gameService: IGameService,
  ) {}

  @Post('/start/:contestId')
  public async start(@Param('contestId') contestId: string): Promise<any> {
    const game = await this.gameService.start(contestId);

    return {
      contestId: game.contestId as string,
      gameId: game.id,
      message: 'Game was successfully created',
    };
  }

  @Get('/:gameId')
  public async get(@Param('gameId') gameId: string): Promise<GetPairResponse> {
    const game = await this.gameService.findGameById(gameId);

    return {
      round: game.round,
      totalRounds: game.totalRounds,
      pairNumber: game.pairNumber,
      pairsInRound: game.pairsInRound,
      contestId: game.contestId as string,
      finished: game.finished,
      pair: game.pair as ContestItem[],
    };
  }

  @Post('/:gameId')
  @UsePipes(new JoiValidationPipe(gamePlaySchema, 'body'))
  public async play(
    @Param('gameId') gameId: string,
    @Body() { winnerId }: { winnerId: string },
  ): Promise<GetPairResponse> {
    await this.gameService.playRound(gameId, winnerId);
    const game = await this.gameService.findGameById(gameId);

    return {
      round: game.round,
      totalRounds: game.totalRounds,
      pairNumber: game.pairNumber,
      pairsInRound: game.pairsInRound,
      contestId: game.contestId as string,
      finished: game.finished,
      pair: game.pair as ContestItem[],
    };
  }
}
