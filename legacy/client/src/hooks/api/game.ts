import {
  MutationResultPair,
  QueryResult,
  useMutation,
  useQuery,
} from 'react-query';
import { AxiosResponse } from 'axios';

import api from '../../providers/apiProvider';
import ROUTES from '../../utils/routes';
import {
  GetPairResponse,
  StartResponse,
} from '../../../../server/controllers/game/types';

export const useGameApi = () => {
  const baseURL = ROUTES.API.GAME;
  const start = (contestId: string) =>
    api.post<StartResponse>(`${baseURL}/start/${contestId}`);
  const getState = (id: string) => api.get<GetPairResponse>(`${baseURL}/${id}`);
  const choose = (gameId: string, winnerId: string) =>
    api.post<GetPairResponse>(`${baseURL}/${gameId}`, { winnerId });
  return { start, getState, choose };
};

export const useGameStart = (): MutationResultPair<
  AxiosResponse<StartResponse>,
  string,
  Error
> => {
  const { start } = useGameApi();
  return useMutation(start);
};

export const useGameState = (
  id: string,
  config = {},
): QueryResult<AxiosResponse<GetPairResponse>> => {
  const { getState } = useGameApi();
  return useQuery(['game', id], () => getState(id), { retry: 0, ...config });
};

export const useGameChoose = (
  gameId: string,
): MutationResultPair<AxiosResponse<GetPairResponse>, string, Error> => {
  const { choose } = useGameApi();
  return useMutation((winnerId) => choose(gameId, winnerId));
};
