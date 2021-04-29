import {
  CreateContestItemDto,
  GetItemsQuery,
  GetItemsResponse,
} from '@lets-choose/common';

import { ContestItem } from '../modules/contest/contest-item.entity';

export interface IContestItemRepository {
  countDocuments(contestId?: string): Promise<number>;
  paginate(contestId: string, data: GetItemsQuery): Promise<GetItemsResponse>;
  findById(itemId: string): Promise<ContestItem>;
  findByContestId(contestId: string): Promise<ContestItem[]>;
  findByIdAndUpdate(
    itemId: string,
    contestItem: Partial<ContestItem>,
  ): Promise<ContestItem>;
  updateContestItems(
    contestId: string,
    data: Partial<ContestItem>,
  ): Promise<void>;
  deleteContestItems(contestId: string): Promise<void>;
  createContestItem(data: CreateContestItemDto): Promise<ContestItem>;
}
