import { injectable } from 'inversify';
import {
  CreateContestData,
  IContestRepository,
} from '../../../repositories/ContestRepository';
import { Contest } from '../../../models/Contest';
import contests from './data/contests';

const test = jest.fn();

@injectable()
export default class ContestRepository implements IContestRepository {
  private contests = contests;

  // countDocuments = jest.fn(async () => this.contests.length);

  async countDocuments(): Promise<number> {
    return this.contests.length;
  }
  async aggregate(aggregations?: any[]): Promise<Contest[]> {
    return this.contests;
  }
  async findById(contestId: string): Promise<Contest> {
    const contest = this.contests.find(({ id }) => contestId === id);
    if (!contest) {
      throw new Error('contest not found');
    }
    return contest;
  }
  async findByAuthor(author: string): Promise<Contest[]> {
    return this.contests.filter(({ author: a }) => author === a) as Contest[];
  }
  async findByIdAndUpdate(
    contestId: string,
    data: Partial<Contest>,
  ): Promise<Contest> {
    this.contests = contests.map((contest) => {
      if (contest.id === contestId) {
        return {
          ...contest,
          ...data,
        };
      }
      return contest;
    });
    return this.findById(contestId);
  }
  async deleteContest(contestId: string): Promise<Contest> {
    const contest = await this.findById(contestId);
    this.contests = this.contests.filter(({ id }) => contestId !== id);
    return contest;
  }
  async createContest(data: CreateContestData): Promise<Contest> {
    const contest: Contest = {
      id: data._id,
      games: 0,
      createdAt: new Date(),
      items: [],
      ...data,
    };
    this.contests.push(contest);
    return contest;
  }
}
