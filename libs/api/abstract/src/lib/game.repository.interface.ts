import { CreateGameDto, GameDto } from '@lets-choose/common/dto';

export interface IGameRepository {
  countDocuments(): Promise<number>;
  aggregate(aggregations?: unknown[]): Promise<GameDto[]>;
  findById(gameId: string): Promise<GameDto>;
  findByIdAndUpdate(gameId: string, data: Partial<GameDto>): Promise<GameDto>;
  deleteGame(gameId: string): Promise<GameDto>;
  deleteGames(contestId): Promise<void>;
  createGame(data: CreateGameDto & { _id: string }): Promise<GameDto>;
}
