import { ContestDto, ContestItemDto } from './contest.dto';

export abstract class GameItem {
  contestItem: ContestItemDto | string;
  wins: number;
  compares: number;
}

export abstract class Game {
  _id: string;
  readonly id: string;
  contestId: ContestDto | string;
  winnerId?: ContestItemDto | string;
  items?: GameItem[];
  pair: (ContestItemDto | string)[];
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
  pair: ContestItemDto[];
}

export interface GameStartResponse {
  contestId: string;
  gameId: string;
  message: string;
}
