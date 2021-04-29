import { Game } from '../modules/game/game.entity';

export interface IGameService {
  start(contestId: string): Promise<Game>;
  findGameById(gameId: string): Promise<Game>;
  playRound(gameId: string, winnerId: string): Promise<void>;
}
