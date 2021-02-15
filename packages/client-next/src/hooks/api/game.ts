import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { GetPairResponse, GameStartResponse } from '@lets-choose/common';

import api from '../../providers/apiProvider';
import ROUTES from '../../utils/routes';

export const useGameApi = () => {
  const baseURL = ROUTES.API.GAMES;
  const start = (contestId: string) =>
    api.post<GameStartResponse>(`${baseURL}/start/${contestId}`);
  const getState = (id: string) => api.get<GetPairResponse>(`${baseURL}/${id}`);
  const choose = (gameId: string, winnerId: string) =>
    api.post<GetPairResponse>(`${baseURL}/${gameId}`, { winnerId });
  return { start, getState, choose };
};

export const useGameStart = () => {
  const { start } = useGameApi();
  return useMutation(start);
};

export const useGameState = (id: string) => {
  const { getState } = useGameApi();
  return useMutation<AxiosResponse<GetPairResponse>>(() => getState(id));
};

export const useGameChoose = (gameId: string) => {
  const { choose } = useGameApi();
  return useMutation((winnerId: string) => choose(gameId, winnerId));
};
