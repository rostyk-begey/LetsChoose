import {
  IContestItemRepository,
  IContestRepository,
  IGameRepository,
  IGameService,
} from '@lets-choose/api/abstract';
import {
  ContestItem,
  ContestItemRepository,
  ContestRepository,
} from '@lets-choose/api/contest/data-access';
import {
  Game,
  GameItem,
  GameRepository,
} from '@lets-choose/api/game/data-access';
import { ContestItemDto, GameDto } from '@lets-choose/common/dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { shuffle } from 'lodash';
import mongoose from 'mongoose';

@Injectable()
export class GameService implements IGameService {
  constructor(
    @Inject(ContestRepository)
    private readonly contestRepository: IContestRepository,

    @Inject(ContestItemRepository)
    private readonly contestItemRepository: IContestItemRepository,

    @Inject(GameRepository)
    private readonly gameRepository: IGameRepository,
  ) {}

  protected static generatePair(items: GameItem[]): string[] {
    return shuffle(items)
      .slice(0, 2)
      .map(({ contestItem }) => contestItem.toString());
  }

  protected static calculateGameItemsLength(allItemsLength: number): number {
    return 2 ** Math.floor(Math.log2(allItemsLength));
  }

  protected static produceGameItems(
    items: ContestItemDto[],
    gameItemsLength: number,
  ): GameItem[] {
    return shuffle(items)
      .slice(0, gameItemsLength)
      .map(({ id }) => ({
        contestItem: id,
        wins: 0,
        compares: 0,
      }));
  }

  protected static calculateTotalRounds(gameItemsLength: number): number {
    return Math.log2(gameItemsLength);
  }

  protected inGamePair(
    gamePair: [ContestItemDto, ContestItemDto],
    contestItemId: string,
  ): boolean {
    return gamePair.some(({ id }) => contestItemId === id);
  }

  protected updateGameItems(
    gameItems: Array<mongoose.Document & GameItem>,
    currentPair: [ContestItemDto, ContestItemDto],
    winnerId: string,
  ): GameItem[] {
    return gameItems.map((item) => {
      const { contestItem: contestItemId } = item;
      const resultItems = { ...item };
      if (this.inGamePair(currentPair, contestItemId as string)) {
        resultItems.compares += 1;
      }

      if (winnerId === `${contestItemId}`) {
        resultItems.wins += 1;
      }

      return resultItems;
    });
  }

  protected getNextRoundItems(
    gameItems: GameItem[],
    round: number,
  ): GameItem[] {
    return gameItems.filter(
      ({ compares, wins }) => round === compares && round === wins,
    );
  }

  public async start(contestId: string): Promise<GameDto> {
    await this.contestRepository.findById(contestId);

    const contestItems = await this.contestItemRepository.findByContestId(
      contestId,
    );

    const gameItemsLength = GameService.calculateGameItemsLength(
      contestItems.length,
    );

    const gameItems = GameService.produceGameItems(
      contestItems,
      gameItemsLength,
    );

    const pair = GameService.generatePair(gameItems);

    const totalRounds = GameService.calculateTotalRounds(gameItems.length);

    const game = await this.gameRepository.createGame({
      contestId,
      items: gameItems,
      finished: false,
      round: 0,
      pairNumber: 0,
      pairsInRound: gameItems.length / 2,
      totalRounds,
      pair,
    });
    return await this.gameRepository.findById(game.id);
  }

  public findGameById(gameId: string): Promise<GameDto> {
    return this.gameRepository.findById(gameId);
  }

  protected playRoundUpdateGame(game: GameDto, winnerId: string): GameDto {
    if (game.finished) {
      throw new BadRequestException('Game has been finished');
    }

    if (!this.inGamePair(game.pair as [ContestItem, ContestItem], winnerId)) {
      throw new BadRequestException('Invalid winner id');
    }

    game.items = this.updateGameItems(
      game.items as Array<mongoose.Document & GameItem>,
      game.pair as [ContestItem, ContestItem],
      winnerId,
    );

    let roundItems = this.getNextRoundItems(
      game.items as GameItem[],
      game.round,
    );

    // no items left on this round, go to next round
    if (roundItems.length === 0) {
      game.round += 1;
      game.pairNumber = -1;
      roundItems = this.getNextRoundItems(game.items as GameItem[], game.round);
      game.pairsInRound = roundItems.length > 1 ? roundItems.length / 2 : 0;
    }

    if (roundItems.length > 1) {
      game.pair = GameService.generatePair(roundItems);
      game.pairNumber += 1;
    }
    // games has finished
    else {
      game.finished = true;
      game.winnerId = winnerId;
    }

    return game;
  }

  private async updateContestItemsOnGameFinish(
    game: GameDto,
    winnerId: string,
  ): Promise<void> {
    await Promise.all(
      game.items.map(async (gameItem) => {
        const { contestItem: itemId, compares, wins } = gameItem;
        const contestItem = await this.contestItemRepository.findById(
          itemId as string,
        );

        contestItem.compares += compares;
        contestItem.wins += wins;
        contestItem.games += 1;

        if (winnerId === itemId) {
          contestItem.finalWins += 1;
        }

        await this.contestItemRepository.findByIdAndUpdate(
          contestItem.id,
          contestItem,
        );
      }),
    );
  }

  private async updateContestOnGameFinish(game: GameDto): Promise<void> {
    const contest = await this.contestRepository.findById(
      game.contestId as string,
    );

    contest.games += 1;

    await this.contestRepository.findByIdAndUpdate(contest.id, contest);
  }

  public async playRound(gameId: string, winnerId: string): Promise<void> {
    let game = await this.findGameById(gameId);

    game = this.playRoundUpdateGame(game, winnerId);

    if (game.finished) {
      game.pair = [];
      await this.updateContestOnGameFinish(game);
      await this.updateContestItemsOnGameFinish(game, winnerId);
    }

    await this.gameRepository.findByIdAndUpdate(game.id, game);
  }
}
