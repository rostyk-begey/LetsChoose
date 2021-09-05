import { Contest, ContestItem } from './contest.dto';

export abstract class GameItem {
  contestItem: ContestItem | string;
  wins: number;
  compares: number;
}

export abstract class Game {
  _id: string;
  readonly id: string;
  contestId: Contest | string;
  winnerId?: ContestItem | string;
  items?: GameItem[];
  pair: (ContestItem | string)[];
  pairNumber: number;
  pairsInRound: number;
  round: number;
  finished: boolean;
  totalRounds: number;
}

export type CreateGameDto = Omit<Game, 'id'>;

export interface GetPairResponse {
  round: number;
  totalRounds: number;
  pairNumber: number;
  pairsInRound: number;
  contestId: string;
  finished: boolean;
  pair: ContestItem[];
}

export interface GameStartResponse {
  contestId: string;
  gameId: string;
  message: string;
}
