import {
  ContestDto,
  GetContestsQuery,
  GetContestsResponse,
} from '@lets-choose/common/dto';

export type CreateContestData = Omit<
  ContestDto,
  'id' | 'items' | 'games' | 'createdAt'
> & { _id: string };

export interface IContestRepository {
  countDocuments(authorId?: string): Promise<number>;
  paginate(data: GetContestsQuery): Promise<GetContestsResponse>;
  findById(contestId: string): Promise<ContestDto>;
  findByAuthor(author: string): Promise<ContestDto[]>;
  findByIdAndUpdate(
    contestId: string,
    data: Partial<ContestDto>,
  ): Promise<ContestDto>;
  deleteContest(contestId: string): Promise<ContestDto>;
  createContest(data: CreateContestData): Promise<ContestDto>;
}
