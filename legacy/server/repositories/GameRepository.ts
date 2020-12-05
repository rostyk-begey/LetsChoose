import { injectable } from 'inversify';

import { Game, GameModel } from '../models/Game';
import { AppError } from '../usecases/error';

export type CreateGameData = Omit<Game, 'id'>;

export interface IGameRepository {
  countDocuments(): Promise<number>;
  aggregate(aggregations?: any[]): Promise<Game[]>;
  findById(gameId: string): Promise<Game>;
  findByIdAndUpdate(gameId: string, data: Partial<Game>): Promise<Game>;
  deleteGame(gameId: string): Promise<Game>;
  createGame(data: CreateGameData): Promise<Game>;
}

@injectable()
export default class GameRepository implements IGameRepository {
  public async countDocuments(): Promise<number> {
    const res = await GameModel.countDocuments();
    return res as number;
  }

  public aggregate(aggregations?: any[]): Promise<Game[]> {
    return GameModel.aggregate(aggregations).exec();
  }

  public async findById(gameId: string): Promise<Game> {
    const game = await GameModel.findById(gameId)
      .populate('items')
      .populate('pair');
    if (!game) {
      throw new AppError('Game not found', 404);
    }
    return game;
  }

  public async findByIdAndUpdate(
    gameId: string,
    data: Partial<Game>,
  ): Promise<Game> {
    const game = await GameModel.findByIdAndUpdate(gameId, data);
    if (!game) {
      throw new AppError('Game not found', 404);
    }
    return game;
  }

  public async deleteGame(gameId: string): Promise<Game> {
    const game = await GameModel.findByIdAndRemove(gameId);
    if (!game) {
      throw new AppError('Game not found', 404);
    }
    return game;
  }

  public async createGame(data: CreateGameData): Promise<Game> {
    const game = new GameModel(data);
    await game.save();
    return game;
  }
}
