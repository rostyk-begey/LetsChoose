import { Game } from '@lets-choose/api/game/data-access';
import { CreateGameDto } from '@lets-choose/common/dto';

export interface IGameRepository {
  countDocuments(): Promise<number>;
  aggregate(aggregations?: any[]): Promise<Game[]>;
  findById(gameId: string): Promise<Game>;
  findByIdAndUpdate(gameId: string, data: Partial<Game>): Promise<Game>;
  deleteGame(gameId: string): Promise<Game>;
  deleteGames(contestId): Promise<void>;
  createGame(data: CreateGameDto): Promise<Game>;
}
