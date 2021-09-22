import { IGameService } from '@lets-choose/api/abstract';
import { JoiValidationPipe } from '@lets-choose/api/common/pipes';
import {
  GameDto,
  GameStartResponse,
  GetPairResponse,
} from '@lets-choose/common/dto';
import { API_ROUTES } from '@lets-choose/common/utils';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { GameService } from './game.service';
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
  public async get(@Param('gameId') gameId: string): Promise<GameDto> {
    return await this.gameService.findGameById(gameId);
  }

  @Post('/:gameId')
  @UsePipes(new JoiValidationPipe(gameIdSchema, 'param'))
  @UsePipes(new JoiValidationPipe(gamePlaySchema, 'body'))
  public async play(
    @Param('gameId') gameId: string,
    @Body() { winnerId }: { winnerId: string },
  ): Promise<GameDto> {
    await this.gameService.playRound(gameId, winnerId);

    return this.get(gameId);
  }
}
