import { CreateContestItemDto } from '@lets-choose/common';

import { ContestItem } from '../modules/contest/contest-item.schema';

export interface IContestItemRepository {
  countDocuments(contestId?: string): Promise<number>;
  aggregate(aggregations?: any[]): Promise<ContestItem[]>;
  findById(itemId: string): Promise<ContestItem>;
  findByContestId(contestId: string): Promise<ContestItem[]>;
  findByIdAndUpdate(
    contestId: string,
    contestItem: Partial<ContestItem>,
  ): Promise<ContestItem>;
  deleteContestItems(contestId: string): Promise<void>;
  createContestItem(data: CreateContestItemDto): Promise<ContestItem>;
}
