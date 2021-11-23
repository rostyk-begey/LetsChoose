import { GameApi } from '@lets-choose/client/api';
import { useMutation } from 'react-query';

export const useGameApi = new GameApi();

export const useGameChoose = (gameId: string) => {
  return useMutation((winnerId: string) => useGameApi.choose(gameId, winnerId));
};
