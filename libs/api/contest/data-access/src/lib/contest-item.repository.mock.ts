import { IContestItemRepository } from '@lets-choose/api/abstract';
import { ContestItem } from '@lets-choose/api/contest/data-access';

export interface ExtendedContestItem extends ContestItem {
  winRate?: number;
  finalWinRate?: number;
  rankScore?: number;
}

export const contestItemRepositoryMock: jest.Mocked<IContestItemRepository> = {
  countDocuments: jest.fn(),
  paginate: jest.fn(),
  findById: jest.fn(),
  findByContestId: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  updateContestItems: jest.fn(),
  deleteContestItems: jest.fn(),
  createContestItem: jest.fn(),
};
