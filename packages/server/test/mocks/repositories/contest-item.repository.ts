import { CreateContestItemDto } from '@lets-choose/common';
import { Types } from 'mongoose';

import { ContestItem } from '../../../src/modules/contest/contest-item.schema';
import { IContestItemRepository } from '../../../src/abstract/contest-item.repository.interface';

import contestItems, { ExtendedContestItem } from './data/contestItems';

export let mockContestItems = [...contestItems];

const ContestItemRepository: IContestItemRepository = {
  async countDocuments(): Promise<number> {
    return mockContestItems.length;
  },
  async aggregate(aggregations?: any[]): Promise<ContestItem[]> {
    return mockContestItems;
  },
  async findById(itemId: string): Promise<ContestItem> {
    const contestItem = mockContestItems.find(({ id }) => itemId === id);
    if (!contestItem) {
      throw new Error('contest item not found');
    }
    return contestItem;
  },
  async findByContestId(contestId: string): Promise<ContestItem[]> {
    return mockContestItems.filter(({ contestId: cId }) => contestId === cId);
  },
  async deleteContestItems(contestId: string): Promise<void> {
    mockContestItems = mockContestItems.filter(
      ({ contestId: cId }) => contestId !== cId,
    );
  },
  async createContestItem(data: CreateContestItemDto): Promise<ContestItem> {
    const id = new Types.ObjectId().toString();
    const contest: ExtendedContestItem = {
      _id: id,
      id: id,
      games: 0,
      compares: 0,
      wins: 0,
      finalWins: 0,
      ...data,
    };
    mockContestItems.push(contest);
    return contest;
  },
};

ContestItemRepository.countDocuments = jest.fn(
  ContestItemRepository.countDocuments,
);
ContestItemRepository.aggregate = jest.fn(ContestItemRepository.aggregate);
ContestItemRepository.findById = jest.fn(ContestItemRepository.findById);
ContestItemRepository.findByContestId = jest.fn(
  ContestItemRepository.findByContestId,
);
ContestItemRepository.deleteContestItems = jest.fn(
  ContestItemRepository.deleteContestItems,
);
ContestItemRepository.createContestItem = jest.fn(
  ContestItemRepository.createContestItem,
);

export default ContestItemRepository;
