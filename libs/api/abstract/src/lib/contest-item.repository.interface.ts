import { ContestItem } from '@lets-choose/api/contest/data-access';
import {
  CreateContestItemDto,
  GetItemsQuery,
  GetItemsResponse,
} from '@lets-choose/common/dto';

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
  createContestItem(
    data: Omit<CreateContestItemDto, 'id'>,
  ): Promise<ContestItem>;
}
