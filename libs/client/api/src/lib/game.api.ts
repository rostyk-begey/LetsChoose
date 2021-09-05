import { ROUTES } from '@lets-choose/client/utils';
import { GameStartResponse, GetPairResponse } from '@lets-choose/common/dto';

import { Api } from './api';

export class GameApi extends Api {
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
