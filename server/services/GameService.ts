import mongoose from 'mongoose';
import { shuffle } from 'lodash';

import { GameItem } from '../models/GameItem';
import { Game } from '../models/Game';
import { ContestItem, ContestItemModel } from '../models/ContestItem';
import { AppError } from '../usecases/error';
import { IContestRepository } from '../repositories/ContestRepository';
import { IContestItemRepository } from '../repositories/ContestItemRepository';
import { IGameRepository } from '../repositories/GameRepository';

export default class GameService {
  private readonly gameRepository: IGameRepository;

  private readonly contestRepository: IContestRepository;

  private readonly contestItemRepository: IContestItemRepository;

  constructor(
    contestRepository: IContestRepository,
    contestItemRepository: IContestItemRepository,
    gameRepository: IGameRepository,
  ) {
    this.gameRepository = gameRepository;
    this.contestRepository = contestRepository;
    this.contestItemRepository = contestItemRepository;
  }

  private getCurrentRoundItems(gameItems: GameItem[], round: number) {
    return gameItems.filter(
      ({ compares, wins }) => round === compares && round === wins,
    );
  }

  private static generatePair(items: GameItem[]) {
    return shuffle(items)
      .slice(0, 2)
      .map(({ contestItem }) => contestItem!.toString());
  }

  private populatePair(pair: string[]): Promise<(ContestItem | null)[]> {
    return Promise.all(pair.map((id) => ContestItemModel.findById(id)));
  }

  private static calculateGameItemsLength(allItemsLength: number) {
    return allItemsLength > 2 ? Math.floor(Math.log2(allItemsLength)) ** 2 : 2;
  }

  private static produceGameItems(
    items: ContestItem[],
    gameItemLength: number,
  ): GameItem[] {
    return shuffle(items)
      .slice(0, gameItemLength)
      .map(({ _id }) => ({
        contestItem: _id.toString(),
        wins: 0,
        compares: 0,
      }));
  }

  private static calculateTotalRounds(gameItemsLength: number) {
    return gameItemsLength > 2 ? Math.sqrt(gameItemsLength) : 1;
  }

  private inGamePair(gamePair: ContestItem[], id: string) {
    return gamePair.some(({ _id }) => _id.toString() === id);
  }

  private updateGameItems(
    gameItems: GameItem[],
    currentPair: ContestItem[],
    winnerId: string,
  ): GameItem[] {
    return gameItems.map((item) => {
      const { contestItem: contestItemId } = item;
      if (this.inGamePair(currentPair, contestItemId as string)) {
        item.compares += 1;
      }
      if (winnerId === `${contestItemId}`) {
        item.wins += 1;
      }

      return item;
    });
  }

  private getRoundItems(gameItems: GameItem[], round: number): GameItem[] {
    return gameItems.filter(
      ({ compares, wins }) => round === compares && round === wins,
    );
  }

  public async start(contestId: string): Promise<Game> {
    await this.contestRepository.findById(contestId);

    const contestItems = await this.contestItemRepository.findByContestId(
      contestId,
    );

    const gameItemLength = GameService.calculateGameItemsLength(
      contestItems.length,
    );

    const gameItems = GameService.produceGameItems(
      contestItems,
      gameItemLength,
    );

    const pair = GameService.generatePair(gameItems);

    const totalRounds = GameService.calculateTotalRounds(gameItems.length);

    return this.gameRepository.createGame({
      _id: mongoose.Types.ObjectId().toString(),
      contestId,
      items: gameItems,
      finished: false,
      round: 0,
      totalRounds,
      pair,
    });
  }

  public findGameById(gameId: string): Promise<Game> {
    return this.gameRepository.findById(gameId);
  }

  public async playRound(gameId: string, winnerId: string): Promise<void> {
    const game = await this.gameRepository.findById(gameId);

    if (game.finished) {
      throw new AppError('Game has been finished', 400);
    }

    if (!this.inGamePair(game.pair as ContestItem[], winnerId)) {
      throw new AppError('Invalid winner id', 400);
    }

    game.items = this.updateGameItems(
      game.items as GameItem[],
      game.pair as ContestItem[],
      winnerId,
    );

    let roundItems = this.getRoundItems(game.items as GameItem[], game.round);

    // no items left on this round, go to next round
    if (roundItems.length === 0) {
      game.round += 1;
      roundItems = this.getRoundItems(game.items as GameItem[], game.round);
    }

    if (roundItems.length > 1) {
      game.pair = GameService.generatePair(roundItems);
    }
    // game has finished
    else {
      game.finished = true;
      game.winnerId = winnerId;

      const contest = await this.contestRepository.findById(
        game.contestId as string,
      );
      contest.games += 1;
      // @ts-ignore
      await contest.save();

      await Promise.all(
        game.items.map(async (gameItem) => {
          if (gameItem instanceof GameItem) {
            const { contestItem: itemId, compares, wins } = gameItem;
            const contestItem = await this.contestItemRepository.findById(
              itemId as string,
            );
            contestItem.compares += compares;
            contestItem.wins += wins;
            contestItem.games += 1;
            if (winnerId === `${itemId}`) contestItem.finalWins += 1;
            // @ts-ignore
            await contestItem.save();
          }
        }),
      );
    }

    // @ts-ignore
    await game.save();
  }
}
