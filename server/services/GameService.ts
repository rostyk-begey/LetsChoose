import mongoose from 'mongoose';
import { shuffle } from 'lodash';

import { GameItem } from '../models/GameItem';
import { Game, GameModel } from '../models/Game';
import { ContestItem, ContestItemModel } from '../models/ContestItem';
import ContestService from './ContestService';
import { AppError } from '../usecases/error';
import { ContestModel } from '../models/Contest';

export default class GameService {
  private static getCurrentRoundItems(gameItems: GameItem[], round: number) {
    return gameItems.filter(
      ({ compares, wins }) => round === compares && round === wins,
    );
  }

  private static generatePair(items: GameItem[]) {
    return shuffle(items)
      .slice(0, 2)
      .map(({ contestItem }) => contestItem!.toString());
  }

  private static populatePair(pair: string[]): Promise<(ContestItem | null)[]> {
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

  private static async createGame(
    contestId: string,
    items: GameItem[],
  ): Promise<Game> {
    const pair = GameService.generatePair(items);

    const totalRounds = GameService.calculateTotalRounds(items.length);

    const game = new GameModel({
      _id: mongoose.Types.ObjectId(),
      contestId,
      items,
      finished: false,
      round: 0,
      totalRounds,
      pair,
    });

    await game.save();

    return game;
  }

  private static inGamePair(gamePair: ContestItem[], id: string) {
    return gamePair.some(({ _id }) => _id.toString() === id);
  }

  private static updateGameItems(
    gameItems: GameItem[],
    currentPair: ContestItem[],
    winnerId: string,
  ): GameItem[] {
    return gameItems.map((item) => {
      const { contestItem: contestItemId } = item;
      if (GameService.inGamePair(currentPair, contestItemId as string)) {
        item.compares += 1;
      }
      if (winnerId === `${contestItemId}`) {
        item.wins += 1;
      }

      return item;
    });
  }

  private static getRoundItems(
    gameItems: GameItem[],
    round: number,
  ): GameItem[] {
    return gameItems.filter(
      ({ compares, wins }) => round === compares && round === wins,
    );
  }

  public static async start(contestId: string): Promise<Game> {
    await ContestService.findContestById(contestId);

    const contestItems = await ContestItemModel.find({ contestId }); // todo replace

    const gameItemLength = GameService.calculateGameItemsLength(
      contestItems.length,
    );

    const gameItems = GameService.produceGameItems(
      contestItems,
      gameItemLength,
    );

    return GameService.createGame(contestId, gameItems);
  }

  public static async findGameById(gameId: string): Promise<Game> {
    const game = await GameModel.findById(gameId).populate('pair');

    if (!game) {
      throw new AppError('Game not found!', 404);
    }

    return game;
  }

  public static async playRound(
    gameId: string,
    winnerId: string,
  ): Promise<void> {
    const game = await GameService.findGameById(gameId);

    if (game.finished) {
      throw new AppError('Game has been finished', 400);
    }

    if (!GameService.inGamePair(game.pair as ContestItem[], winnerId)) {
      throw new AppError('Invalid winner id', 400);
    }

    game.items = this.updateGameItems(
      game.items as GameItem[],
      game.pair as ContestItem[],
      winnerId,
    );

    let roundItems = GameService.getRoundItems(
      game.items as GameItem[],
      game.round,
    );

    // no items left on this round, go to next round
    if (roundItems.length === 0) {
      game.round += 1;
      roundItems = GameService.getRoundItems(
        game.items as GameItem[],
        game.round,
      );
    }

    if (roundItems.length > 1) {
      game.pair = GameService.generatePair(roundItems);
    }
    // game has finished
    else {
      game.finished = true;
      game.winnerId = winnerId;

      const contest = await ContestModel.findById(game.contestId);
      contest!.games += 1;
      await contest!.save();

      await Promise.all(
        game.items.map(async (gameItem) => {
          if (gameItem instanceof GameItem) {
            const { contestItem: itemId, compares, wins } = gameItem;
            const contestItem = await ContestItemModel.findById(itemId);
            contestItem!.compares += compares;
            contestItem!.wins += wins;
            contestItem!.games += 1;
            if (winnerId === `${itemId}`) contestItem!.finalWins += 1;
            await contestItem!.save();
          }
        }),
      );
    }

    // @ts-ignore
    await game.save();
  }
}
