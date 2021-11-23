import {
  ContestItemDto,
  CreateContestItemDto,
  GetItemsQuery,
  GetItemsResponse,
} from '@lets-choose/common/dto';
import { IRepositoryWithPagination } from './repository-with-pagination.interface';
import { IRepository } from './repository.interface';

export interface IContestItemRepository
  extends IRepository<ContestItemDto, CreateContestItemDto & { _id: any }>,
    IRepositoryWithPagination<
      ContestItemDto,
      GetItemsQuery & { contestId: string },
      GetItemsResponse
    > {
  countDocuments(contestId?: string): Promise<number>;
  paginate(
    data: GetItemsQuery & { contestId: string },
  ): Promise<GetItemsResponse>;
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
  create(data: CreateContestItemDto & { _id: any }): Promise<ContestItemDto>;
}
