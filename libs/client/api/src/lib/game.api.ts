import { ROUTES } from '@lets-choose/client/utils';
import { GameDto, GameStartResponse } from '@lets-choose/common/dto';

import { Api } from './api';

export class GameApi extends Api {
  private readonly baseURL = ROUTES.API.GAMES;

  start = (contestId: string) => {
    return this.api.post<GameStartResponse>(
      `${this.baseURL}/start/${contestId}`,
    );
  };

  find = (id: string) => {
    return this.api.get<GameDto>(`${this.baseURL}/${id}`);
  };

  choose = (gameId: string, winnerId: string) => {
    return this.api.post<GameDto>(`${this.baseURL}/${gameId}`, {
      winnerId,
    });
  };
}
