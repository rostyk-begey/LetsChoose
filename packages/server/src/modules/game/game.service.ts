import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { shuffle } from 'lodash';

import { IContestItemRepository } from '@abstract/contest-item.repository.interface';
import { IGameService } from '@abstract/game.service.interface';
import { IContestRepository } from '@abstract/contest.repository.interface';
import { IGameRepository } from '@abstract/game.repository.interface';
import { TYPES } from '@src/injectable.types';
import { ContestItem } from '@modules/contest/contest-item.entity';
import { GameItem } from '@modules/game/game-item.entity';
import { Game } from '@modules/game/game.entity';

@Injectable()
export class GameService implements IGameService {
  constructor(
    @Inject(TYPES.ContestRepository)
    private readonly contestRepository: IContestRepository,

    @Inject(TYPES.ContestItemRepository)
    private readonly contestItemRepository: IContestItemRepository,

    @Inject(TYPES.GameRepository)
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
    items: ContestItem[],
    gameItemsLength: number,
  ): GameItem[] {
    return shuffle(items)
      .slice(0, gameItemsLength)
      .map(({ _id }) => ({
        contestItem: _id.toString(),
        wins: 0,
        compares: 0,
      }));
  }

  protected static calculateTotalRounds(gameItemsLength: number): number {
    return Math.log2(gameItemsLength);
  }

  protected inGamePair(gamePair: ContestItem[], id: string): boolean {
    return gamePair.some(({ _id }) => _id.toString() === id.toString());
  }

  protected updateGameItems(
    gameItems: GameItem[],
    currentPair: ContestItem[],
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

  public async start(contestId: string): Promise<Game> {
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

    return this.gameRepository.createGame({
      _id: mongoose.Types.ObjectId().toString(),
      contestId,
      items: gameItems,
      finished: false,
      round: 0,
      pairNumber: 0,
      pairsInRound: gameItems.length / 2,
      totalRounds,
      pair,
    });
  }

  public findGameById(gameId: string): Promise<Game> {
    return this.gameRepository.findById(gameId);
  }

  protected playRoundUpdateGame(game: Game, winnerId: string): Game {
    if (game.finished) {
      throw new BadRequestException('Game has been finished');
    }

    if (!this.inGamePair(game.pair as ContestItem[], winnerId)) {
      throw new BadRequestException('Invalid winner id');
    }

    game.items = this.updateGameItems(
      game.items as GameItem[],
      game.pair as ContestItem[],
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

  public async playRound(gameId: string, winnerId: string): Promise<void> {
    let game = await this.findGameById(gameId);

    game = this.playRoundUpdateGame(game, winnerId);

    if (game.finished) {
      const contest = await this.contestRepository.findById(
        game.contestId as string,
      );
      contest.games += 1;
      await this.contestRepository.findByIdAndUpdate(contest.id, contest);

      await Promise.all(
        game.items.map(async (gameItem) => {
          const { contestItem: itemId, compares, wins } = gameItem as GameItem;
          const contestItem = await this.contestItemRepository.findById(
            itemId as string,
          );
          contestItem.compares += compares;
          contestItem.wins += wins;
          contestItem.games += 1;

          if (winnerId === `${itemId}`) {
            contestItem.finalWins += 1;
          }

          await this.contestItemRepository.findByIdAndUpdate(
            contestItem._id,
            contestItem,
          );
        }),
      );
    }

    await this.gameRepository.findByIdAndUpdate(game.id, game);
  }
}
