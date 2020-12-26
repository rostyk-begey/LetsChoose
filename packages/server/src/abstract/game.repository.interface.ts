import { Game } from '../modules/game/game.schema';
import { CreateGameDto } from '@lets-choose/common';

export interface IGameRepository {
  countDocuments(): Promise<number>;
  aggregate(aggregations?: any[]): Promise<Game[]>;
  findById(gameId: string): Promise<Game>;
  findByIdAndUpdate(gameId: string, data: Partial<Game>): Promise<Game>;
  deleteGame(gameId: string): Promise<Game>;
  createGame(data: CreateGameDto): Promise<Game>;
}