import { Game } from '@lets-choose/api/game/data-access';

export interface IGameService {
  start(contestId: string): Promise<Game>;
  findGameById(gameId: string): Promise<Game>;
  playRound(gameId: string, winnerId: string): Promise<void>;
}
