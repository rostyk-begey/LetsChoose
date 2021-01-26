import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Contest, ContestDocument } from './contest.schema';
import {
  CreateContestData,
  IContestRepository,
} from '../../abstract/contest.repository.interface';

@Injectable()
export class ContestRepository implements IContestRepository {
  constructor(
    @InjectModel(Contest.name)
    private readonly contestModel: Model<ContestDocument>,
  ) {}

  public async countDocuments(authorId?: string): Promise<number> {
    const res = authorId
      ? await this.contestModel.countDocuments({ author: authorId })
      : await this.contestModel.countDocuments();
    return res as number;
  }

  public aggregate(aggregations?: any[]): Promise<Contest[]> {
    return this.contestModel.aggregate(aggregations).exec();
  }

  public async findById(contestId: string): Promise<Contest> {
    const contest = await this.contestModel.findById(contestId);
    if (!contest) {
      throw new NotFoundException('Contest not found');
    }
    return contest;
  }

  public async findByAuthor(author: string): Promise<Contest[]> {
    const contests = await this.contestModel.find({ author });
    if (!contests) {
      throw new NotFoundException('Contest not found');
    }
    return contests;
  }

  public async findByIdAndUpdate(
    contestId: string,
    data: Partial<Contest>,
  ): Promise<Contest> {
    const contest = await this.contestModel.findByIdAndUpdate(contestId, data);
    if (!contest) {
      throw new NotFoundException('Contest not found');
    }
    return contest;
  }

  public async deleteContest(contestId: string): Promise<Contest> {
    const contest = await this.contestModel.findByIdAndRemove(contestId);
    if (!contest) {
      throw new NotFoundException('Contest not found');
    }
    return contest;
  }

  public async createContest(data: CreateContestData): Promise<Contest> {
    const contest = new this.contestModel(data);
    await contest.save();
    return contest;
  }
}
