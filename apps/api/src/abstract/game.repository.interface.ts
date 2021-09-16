import { CreateGameDto } from '@lets-choose/common/dto';
import { Game, GameDocument } from '@modules/game/game.entity';

export interface IGameRepository {
  countDocuments(): Promise<number>;
  aggregate(aggregations?: any[]): Promise<Game[]>;
  findById(gameId: string): Promise<GameDocument>;
  findByIdAndUpdate(gameId: string, data: Partial<Game>): Promise<Game>;
  deleteGame(gameId: string): Promise<Game>;
  deleteGames(contestId): Promise<void>;
  createGame(data: CreateGameDto): Promise<Game>;
}
