import { Contest, ContestItem } from './contest.dto';

export interface GameItem {
  contestItem: ContestItem | string;
  wins: number;
  compares: number;
}

export interface Game {
  _id: string;
  readonly id: string;
  contestId: Contest | string;
  winnerId?: ContestItem | string;
  items?: GameItem[];
  pair: (ContestItem | string)[];
  round: number;
  finished: boolean;
  totalRounds: number;
}

export type CreateGameDto = Omit<Game, 'id'>;

export interface GetPairResponse {
  round: number;
  totalRounds: number;
  contestId: string;
  finished: boolean;
  pair: ContestItem[];
}

export interface GameStartResponse {
  contestId: string;
  gameId: string;
  message: string;
}
