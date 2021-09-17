import { CreateGameDto } from '@lets-choose/common/dto';
import { Game, GameDocument } from '@lets-choose/api/game/data-access';

export interface IGameRepository {
  countDocuments(): Promise<number>;
  aggregate(aggregations?: any[]): Promise<Game[]>;
  findById(gameId: string): Promise<Game>;
  findByIdAndUpdate(gameId: string, data: Partial<Game>): Promise<Game>;
  deleteGame(gameId: string): Promise<Game>;
  deleteGames(contestId): Promise<void>;
  createGame(data: CreateGameDto): Promise<Game>;
}