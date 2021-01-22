import { CreateContestItemDto } from '@lets-choose/common';
import { FilterQuery } from 'mongoose';
import { ContestItem } from '../modules/contest/contest-item.schema';

export interface IContestItemRepository {
  countDocuments(criteria?: FilterQuery<ContestItem>): Promise<number>;
  aggregate(aggregations?: any[]): Promise<ContestItem[]>;
  findById(itemId: string): Promise<ContestItem>;
  findByContestId(contestId: string): Promise<ContestItem[]>;
  deleteContestItems(contestId: string): Promise<void>;
  createContestItem(data: CreateContestItemDto): Promise<ContestItem>;
}
