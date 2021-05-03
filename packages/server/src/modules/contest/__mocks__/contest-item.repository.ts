import { IContestItemRepository } from '../../../abstract/contest-item.repository.interface';
import { ContestItem } from '../contest-item.entity';

export interface ExtendedContestItem extends ContestItem {
  winRate?: number;
  finalWinRate?: number;
  rankScore?: number;
}

export const contestItem: ExtendedContestItem = {
  _id: 'contestItemId',
  title: 'title',
  image: 'image',
  contestId: 'contestId',
  id: 'contestItemId',
  games: 0,
  compares: 0,
  wins: 0,
  winRate: 0,
  finalWins: 0,
  finalWinRate: 0,
  rankScore: 0,
};

const contestItemRepository: jest.Mocked<IContestItemRepository> = {
  countDocuments: jest.fn().mockResolvedValue(1),
  paginate: jest.fn().mockResolvedValue({
    items: [contestItem],
    currentPage: 1,
    totalPages: 1,
    totalItems: 1,
  }),
  findById: jest.fn().mockResolvedValue(contestItem),
  findByContestId: jest.fn().mockResolvedValue([contestItem]),
  findByIdAndUpdate: jest.fn().mockResolvedValue(contestItem),
  updateContestItems: jest.fn().mockResolvedValue(undefined),
  deleteContestItems: jest.fn().mockResolvedValue(undefined),
  createContestItem: jest.fn().mockResolvedValue(contestItem),
};

export default contestItemRepository;
