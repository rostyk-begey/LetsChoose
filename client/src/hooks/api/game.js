import { useMutation, useQuery } from 'react-query';

import api from 'app/providers/apiProvider';
import ROUTES from 'app/utils/routes';

export const useGameApi = () => {
  const baseURL = ROUTES.API.GAME;
  const start = (contestId) => api.post(`${baseURL}/start/${contestId}`);
  const getState = (id) => api.get(`${baseURL}/${id}`);
  const choose = (gameId, winnerId) =>
    api.post(`${baseURL}/${gameId}`, { winnerId });
  return { start, getState, choose };
};

export const useGameStart = () => {
  const { start } = useGameApi();
  return useMutation(start);
};

export const useGameState = (id, config = {}) => {
  const { getState } = useGameApi();
  return useQuery(['game', id], () => getState(id), { retry: 0, ...config });
};

export const useGameChoose = (gameId) => {
  const { choose } = useGameApi();
  return useMutation((winnerId) => choose(gameId, winnerId));
};
