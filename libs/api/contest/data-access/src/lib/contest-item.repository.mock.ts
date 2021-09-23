import { IContestItemRepository } from '@lets-choose/api/abstract';
import { ContestItem } from './contest-item.entity';

export interface ExtendedContestItem extends ContestItem {
  winRate?: number;
  finalWinRate?: number;
  rankScore?: number;
}

export const contestItemRepositoryMock: jest.Mocked<IContestItemRepository> = {
  all: jest.fn(),
  count: jest.fn(),
  countDocuments: jest.fn(),
  paginate: jest.fn(),
  findById: jest.fn(),
  findByContestId: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndRemove: jest.fn(),
  updateContestItems: jest.fn(),
  deleteContestItems: jest.fn(),
  create: jest.fn(),
};
