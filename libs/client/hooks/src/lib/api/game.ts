import { GameApi } from '@lets-choose/client/api';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { GameDto } from '@lets-choose/common/dto';

export const useGameApi = new GameApi();

export const useGameStart = () => {
  return useMutation(useGameApi.start);
};

export const useGameState = (id: string) => {
  return useMutation<AxiosResponse<GameDto>>(() => useGameApi.find(id));
};

export const useGameChoose = (gameId: string) => {
  return useMutation((winnerId: string) => useGameApi.choose(gameId, winnerId));
};
