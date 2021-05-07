import { GameStartResponse, GetPairResponse } from '@lets-choose/common';

import ROUTES from '../utils/routes';
import Api from './api';

export default class GameApi extends Api {
  private readonly baseURL = ROUTES.API.GAMES;

  start = (contestId: string) => {
    return this.api.post<GameStartResponse>(
      `${this.baseURL}/start/${contestId}`,
    );
  };

  getState = (id: string) => {
    return this.api.get<GetPairResponse>(`${this.baseURL}/${id}`);
  };

  choose = (gameId: string, winnerId: string) => {
    return this.api.post<GetPairResponse>(`${this.baseURL}/${gameId}`, {
      winnerId,
    });
  };
}
