import {
  ContestItemDto,
  CreateContestItemDto,
  GetItemsQuery,
  GetItemsResponse,
} from '@lets-choose/common/dto';

export interface IContestItemRepository {
  countDocuments(contestId?: string): Promise<number>;
  paginate(contestId: string, data: GetItemsQuery): Promise<GetItemsResponse>;
  findById(itemId: string): Promise<ContestItemDto>;
  findByContestId(contestId: string): Promise<ContestItemDto[]>;
  findByIdAndUpdate(
    itemId: string,
    contestItem: Partial<ContestItemDto>,
  ): Promise<ContestItemDto>;
  updateContestItems(
    contestId: string,
    data: Partial<ContestItemDto>,
  ): Promise<void>;
  deleteContestItems(contestId: string): Promise<void>;
  createContestItem(
    data: Omit<CreateContestItemDto, 'id'>,
  ): Promise<ContestItemDto>;
}
