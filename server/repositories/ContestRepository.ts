import { Query } from 'mongoose';

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

export default class ContestRepository implements IContestRepository {
  public async countDocuments(): Promise<number> {
    const res = await ContestModel.countDocuments();
    return res as number;
  }

  public aggregate(aggregations?: any[]): Promise<Contest[]> {
    return ContestModel.aggregate(aggregations).exec();
  }

  public async findById(contestId: string): Promise<Contest> {
    const user = await ContestModel.findById(contestId);
    if (!user) {
      throw new AppError('Contest not found', 404);
    }
    return user;
  }

  public async findByIdAndUpdate(
    contestId: string,
    data: Partial<Contest>,
  ): Promise<Contest> {
    const user = await ContestModel.findByIdAndUpdate(contestId, data);
    if (!user) {
      throw new AppError('Contest not found', 404);
    }
    return user;
  }

  public async deleteContest(contestId: string): Promise<Contest> {
    const user = await ContestModel.findByIdAndRemove(contestId);
    if (!user) {
      throw new AppError('Contest not found', 404);
    }
    return user;
  }

  public async createContest(data: CreateContestData): Promise<Contest> {
    const user = new ContestModel(data);
    await user.save();
    return user;
  }
}
