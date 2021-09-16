import { IContestItemRepository } from '@abstract/contest-item.repository.interface';
import { build, fake, sequence } from '@jackfranklin/test-data-bot';
import { ContestItem } from '@lets-choose/api/contest/data-access';

export interface ExtendedContestItem extends ContestItem {
  winRate?: number;
  finalWinRate?: number;
  rankScore?: number;
}

export const contestItemBuilder = build<ExtendedContestItem>({
  fields: {
    _id: sequence((i) => `contest-item-${i}`),
    id: sequence((i) => `contest-item-${i}`),
    title: fake((f) => f.lorem.slug()),
    image: fake((f) => f.image.image()),
    contestId: sequence((i) => `contest-${i}`),
    finalWins: fake((f) => f.random.number({ min: 0, precision: 1 })),
    wins: fake((f) => f.random.number({ min: 0, precision: 1 })),
    games: fake((f) => f.random.number({ min: 0, precision: 1 })),
    compares: fake((f) => f.random.number({ min: 0, precision: 1 })),
    winRate: fake((f) => f.random.number({ min: 0, precision: 1 })),
    finalWinRate: fake((f) => f.random.number({ min: 0, precision: 1 })),
    rankScore: fake((f) => f.random.number({ min: 0, precision: 1 })),
  },
  postBuild: (res) => ({
    ...res,
    id: res._id,
  }),
});

const contestItemRepository: jest.Mocked<IContestItemRepository> = {
  countDocuments: jest.fn(),
  paginate: jest.fn(),
  findById: jest.fn(),
  findByContestId: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  updateContestItems: jest.fn(),
  deleteContestItems: jest.fn(),
  createContestItem: jest.fn(),
};

export default contestItemRepository;
