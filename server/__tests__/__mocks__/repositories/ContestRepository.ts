import {
  CreateContestData,
  IContestRepository,
} from '../../../repositories/ContestRepository';
import { Contest } from '../../../models/Contest';
import contests from './data/contests';
import { AppError } from '../../../usecases/error';

export let mockContests = [...contests];

const ContestRepository: IContestRepository = {
  async countDocuments(): Promise<number> {
    return mockContests.length;
  },
  async aggregate(aggregations?: any[]): Promise<Contest[]> {
    return mockContests;
  },
  async findById(contestId: string): Promise<Contest> {
    const contest = mockContests.find(({ id }) => contestId === id);
    if (!contest) {
      throw new AppError('Contest not found', 404);
    }
    return contest;
  },
  async findByAuthor(author: string): Promise<Contest[]> {
    return mockContests.filter(({ author: a }) => author === a) as Contest[];
  },
  async findByIdAndUpdate(
    contestId: string,
    data: Partial<Contest>,
  ): Promise<Contest> {
    mockContests = contests.map((contest) => {
      if (contest.id === contestId) {
        return {
          ...contest,
          ...data,
        };
      }
      return contest;
    });
    return this.findById(contestId);
  },
  async deleteContest(contestId: string): Promise<Contest> {
    const contest = await this.findById(contestId);
    mockContests = mockContests.filter(({ id }) => contestId !== id);
    return contest;
  },
  async createContest(data: CreateContestData): Promise<Contest> {
    const contest: Contest = {
      id: data._id,
      games: 0,
      createdAt: new Date(),
      items: [],
      ...data,
    };
    mockContests.push(contest);
    return contest;
  },
};

ContestRepository.countDocuments = jest.fn(ContestRepository.countDocuments);
ContestRepository.aggregate = jest.fn(ContestRepository.aggregate);
ContestRepository.findById = jest.fn(ContestRepository.findById);
ContestRepository.findByAuthor = jest.fn(ContestRepository.findByAuthor);
ContestRepository.findByIdAndUpdate = jest.fn(
  ContestRepository.findByIdAndUpdate,
);
ContestRepository.deleteContest = jest.fn(ContestRepository.deleteContest);

export default ContestRepository;
