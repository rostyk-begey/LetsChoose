import {
  Contest,
  GetContestsQuery,
  GetContestsResponse,
} from '@lets-choose/common/dto';

export type CreateContestData = Omit<
  Contest,
  'id' | 'items' | 'games' | 'createdAt'
>;

export interface IContestRepository {
  countDocuments(authorId?: string): Promise<number>;
  paginate(data: GetContestsQuery): Promise<GetContestsResponse>;
  findById(contestId: string): Promise<Contest>;
  findByAuthor(author: string): Promise<Contest[]>;
  findByIdAndUpdate(
    contestId: string,
    data: Partial<Contest>,
  ): Promise<Contest>;
  deleteContest(contestId: string): Promise<Contest>;
  createContest(data: CreateContestData): Promise<Contest>;
}
