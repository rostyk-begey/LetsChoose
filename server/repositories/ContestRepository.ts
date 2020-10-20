import { injectable } from 'inversify';

import { Contest, ContestModel } from '../models/Contest';
import { AppError } from '../usecases/error';

export type CreateContestData = Omit<Contest, 'id' | 'items' | 'games'>;

export interface IContestRepository {
  countDocuments(): Promise<number>;
  aggregate(aggregations?: any[]): Promise<Contest[]>;
  findById(contestId: string): Promise<Contest>;
  findByIdAndUpdate(
    contestId: string,
    data: Partial<Contest>,
  ): Promise<Contest>;
  deleteContest(contestId: string): Promise<Contest>;
  createContest(data: CreateContestData): Promise<Contest>;
}

@injectable()
export default class ContestRepository implements IContestRepository {
  public async countDocuments(): Promise<number> {
    const res = await ContestModel.countDocuments();
    return res as number;
  }

  public aggregate(aggregations?: any[]): Promise<Contest[]> {
    return ContestModel.aggregate(aggregations).exec();
  }

  public async findById(contestId: string): Promise<Contest> {
    const contest = await ContestModel.findById(contestId);
    if (!contest) {
      throw new AppError('Contest not found', 404);
    }
    return contest;
  }

  public async findByIdAndUpdate(
    contestId: string,
    data: Partial<Contest>,
  ): Promise<Contest> {
    const contest = await ContestModel.findByIdAndUpdate(contestId, data);
    if (!contest) {
      throw new AppError('Contest not found', 404);
    }
    return contest;
  }

  public async deleteContest(contestId: string): Promise<Contest> {
    const contest = await ContestModel.findByIdAndRemove(contestId);
    if (!contest) {
      throw new AppError('Contest not found', 404);
    }
    return contest;
  }

  public async createContest(data: CreateContestData): Promise<Contest> {
    const contest = new ContestModel(data);
    await contest.save();
    return contest;
  }
}
