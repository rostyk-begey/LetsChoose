import { build, fake, oneOf, sequence } from '@jackfranklin/test-data-bot';
import { Game } from '@lets-choose/api/game/data-access';

export const gameBuilder = build<Game>({
  fields: {
    _id: sequence((i) => `game-${i}`),
    id: sequence((i) => `game-${i}`),
    contestId: sequence((i) => `contest-${i}`),
    winnerId: undefined,
    finished: oneOf(false),
    totalRounds: 2,
    items: [],
    round: 0,
    pairNumber: 0,
    pairsInRound: 2,
    pair: [],
  },
  postBuild: (res) => ({
    ...res,
    id: res._id,
  }),
  traits: {
    finished: {
      overrides: {
        winnerId: sequence((i) => `contest-item-${i}`),
        finished: fake(() => true),
      },
    },
  },
});
