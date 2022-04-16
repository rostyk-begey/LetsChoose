import { build, fake, sequence } from '@jackfranklin/test-data-bot';
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ExtendedContestItem } from '../../../../contest/data-access/src/lib/contest-item.repository.mock';

export const contestItemBuilder = build<ExtendedContestItem>({
  fields: {
    _id: sequence((i) => `contest-item-${i}`),
    id: sequence((i) => `contest-item-${i}`),
    title: fake((f) => f.lorem.slug()),
    image: fake((f) => f.image.image()),
    contestId: sequence((i) => `contest-${i}`),
    finalWins: fake((f) => f.datatype.number({ min: 0, precision: 1 })),
    wins: fake((f) => f.datatype.number({ min: 0, precision: 1 })),
    games: fake((f) => f.datatype.number({ min: 0, precision: 1 })),
    compares: fake((f) => f.datatype.number({ min: 0, precision: 1 })),
    winRate: fake((f) => f.datatype.number({ min: 0, precision: 1 })),
    finalWinRate: fake((f) => f.datatype.number({ min: 0, precision: 1 })),
    rankScore: fake((f) => f.datatype.number({ min: 0, precision: 1 })),
  },
  postBuild: (res) => ({
    ...res,
    id: res._id,
  }),
});
