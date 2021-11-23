import { CreateGameDto, GameDto } from '@lets-choose/common/dto';
import { IRepository } from './repository.interface';

export interface IGameRepository extends IRepository<GameDto, CreateGameDto> {
  count(): Promise<number>;
  findById(gameId: string): Promise<GameDto>;
  findByIdAndUpdate(gameId: string, data: Partial<GameDto>): Promise<GameDto>;
  findByIdAndRemove(gameId: string): Promise<GameDto>;
  deleteGames(contestId): Promise<void>;
  create(data: CreateGameDto): Promise<GameDto>;
}
