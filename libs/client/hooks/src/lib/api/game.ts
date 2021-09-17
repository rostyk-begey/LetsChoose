import { GameApi } from '@lets-choose/client/api';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { GetPairResponse } from '@lets-choose/common/dto';

export const useGameApi = new GameApi();

export const useGameStart = () => {
  return useMutation(useGameApi.start);
};

export const useGameState = (id: string) => {
  return useMutation<AxiosResponse<GetPairResponse>>(() =>
    useGameApi.getState(id),
  );
};

export const useGameChoose = (gameId: string) => {
  return useMutation((winnerId: string) => useGameApi.choose(gameId, winnerId));
};
