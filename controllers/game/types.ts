import { Request, Response } from 'express';

import { ContestItem } from '../../models/ContestItem';

export interface StartParams {
  contestId: string;
}

export interface GetPairParams {
  gameId: string;
}

export interface GetPairResponse {
  round: number;
  totalRounds: number;
  contestId: string;
  finished: boolean;
  pair: ContestItem[];
}

export interface StartResponse {
  contestId: string;
  gameId: string;
  message: string;
}
