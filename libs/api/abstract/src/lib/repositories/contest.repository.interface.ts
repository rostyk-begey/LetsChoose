import {
  ContestDto,
  GetContestsQuery,
  GetContestsResponse,
} from '@lets-choose/common/dto';
import { IRepositoryWithPagination } from './repository-with-pagination.interface';
import { IRepository } from './repository.interface';

export type CreateContestData = Omit<
  ContestDto,
  'id' | 'items' | 'games' | 'createdAt'
> & { _id: string };

export interface IContestRepository
  extends IRepository<ContestDto, CreateContestData>,
    IRepositoryWithPagination<
      ContestDto,
      GetContestsQuery,
      GetContestsResponse
    > {
  countByAuthor(authorId: string): Promise<number>;
  paginate(data: GetContestsQuery): Promise<GetContestsResponse>;
  findById(contestId: string): Promise<ContestDto>;
  findByAuthor(author: string): Promise<ContestDto[]>;
  findByIdAndUpdate(
    contestId: string,
    data: Partial<ContestDto>,
  ): Promise<ContestDto>;
  findByIdAndRemove(contestId: string): Promise<ContestDto>;
  create(data: CreateContestData): Promise<ContestDto>;
}
