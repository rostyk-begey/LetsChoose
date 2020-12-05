import { Types } from 'mongoose';

import {
  CreateContestItemData,
  IContestItemRepository,
} from '../../../repositories/ContestItemRepository';
import contestItems, { ExtendedContestItem } from './data/contestItems';
import { ContestItem } from '../../../models/ContestItem';
import { AppError } from '../../../usecases/error';

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
      throw new AppError('contest item not found', 404);
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
  async createContestItem(data: CreateContestItemData): Promise<ContestItem> {
    const id = new Types.ObjectId().toString();
    const contest: ExtendedContestItem = {
      // @ts-ignore
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
