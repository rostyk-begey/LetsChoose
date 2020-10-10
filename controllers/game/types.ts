import { Request, Response } from 'express';

import { ContestItem } from '../../models/ContestItem';

interface StartParams {
  contestId: string;
}

interface GetPairParams {
  gameId: string;
}


interface GetPairResponse {
  round: number,
  totalRounds: number,
  contestId: string,
  finished: boolean,
  pair: (ContestItem | null)[],
}

interface StartResponse {
  contestId: string;
  gameId: string;
  message: string;
}

export interface IGameController {
  start(req: Request<StartParams>, res: Response<StartResponse>): Promise<void>;
  getPair(req: Request<GetPairParams>, res: Response<GetPairResponse>): Promise<void>;
  choose(req: Request, res: Response<GetPairResponse>): Promise<void>;
}