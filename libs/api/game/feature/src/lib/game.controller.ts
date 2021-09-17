import { GameStartResponse, GetPairResponse } from '@lets-choose/common/dto';
import { API_ROUTES } from '@lets-choose/common/utils';
import { GameService } from './game.service';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';

import { IGameService } from '@lets-choose/api/abstract';
import { JoiValidationPipe } from '@lets-choose/api/common/pipes';
import { ContestItem } from '@lets-choose/api/contest/data-access';
import {
  contestIdSchema,
  gameIdSchema,
  gamePlaySchema,
} from './game.validation';

@Controller(API_ROUTES.GAMES)
export class GameController {
  constructor(
    @Inject(GameService)
    protected readonly gameService: IGameService,
  ) {}

  @Post('/start/:contestId')
  @UsePipes(new JoiValidationPipe(contestIdSchema, 'param'))
  public async start(
    @Param('contestId') contestId: string,
  ): Promise<GameStartResponse> {
    const game = await this.gameService.start(contestId);

    return {
      contestId: game.contestId as string,
      gameId: game.id,
      message: 'Game was successfully created',
    };
  }

  @Get('/:gameId')
  @UsePipes(new JoiValidationPipe(gameIdSchema, 'param'))
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
  @UsePipes(new JoiValidationPipe(gameIdSchema, 'param'))
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
