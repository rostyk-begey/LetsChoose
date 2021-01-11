import { useMutation, useQuery } from 'react-query';

import api from '../../providers/apiProvider';
import ROUTES from '../../utils/routes';
import { GetPairResponse, GameStartResponse } from '@lets-choose/common';

export const useGameApi = () => {
  const baseURL = ROUTES.API.GAME;
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

export const useGameState = (id: string, config = {}) => {
  const { getState } = useGameApi();
  return useQuery(['game', id], () => getState(id), { retry: 0, ...config });
};

export const useGameChoose = (gameId: string) => {
  const { choose } = useGameApi();
  return useMutation((winnerId: string) => choose(gameId, winnerId));
};
