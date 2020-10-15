import { checkSchema } from 'express-validator';

export const getGameSchema = checkSchema({
  gameId: {
    in: 'params',
    isString: true,
  },
});

export const startGameSchema = checkSchema({
  contestId: {
    in: 'params',
    isString: true,
  },
});

export const playGameSchema = checkSchema({
  gameId: {
    in: 'params',
    isString: true,
  },
  winnerId: {
    in: 'body',
    isString: true,
  },
});
