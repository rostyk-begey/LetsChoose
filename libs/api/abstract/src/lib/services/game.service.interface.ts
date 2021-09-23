import { GameDto } from '@lets-choose/common/dto';

export interface IGameService {
  start(contestId: string): Promise<GameDto>;
  findGameById(gameId: string): Promise<GameDto>;
  playRound(gameId: string, winnerId: string): Promise<void>;
}
