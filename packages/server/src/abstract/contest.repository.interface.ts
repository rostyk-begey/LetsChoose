import { Contest } from '../modules/contest/contest.schema';

export type CreateContestData = Omit<
  Contest,
  'id' | 'items' | 'games' | 'createdAt'
>;

export interface IContestRepository {
  countDocuments(): Promise<number>;
  aggregate(aggregations?: any[]): Promise<Contest[]>;
  findById(contestId: string): Promise<Contest>;
  findByAuthor(author: string): Promise<Contest[]>;
  findByIdAndUpdate(
    contestId: string,
    data: Partial<Contest>,
  ): Promise<Contest>;
  deleteContest(contestId: string): Promise<Contest>;
  createContest(data: CreateContestData): Promise<Contest>;
}
