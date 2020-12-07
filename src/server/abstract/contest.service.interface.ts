import { Contest } from '../modules/contest/contest.schema';
import {
  CreateContestRequest,
  GetContestQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  UpdateContestRequest,
} from '../../common/dto/contest.dto';

export interface IContestService {
  getContestsPaginate(query: GetContestQuery): Promise<GetContestsResponse>;
  findContestById(id: string): Promise<Contest>;
  findContestsByAuthor(author: string): Promise<Contest[]>;
  getContestItemsPaginate(
    contestId: string,
    query: GetItemsQuery,
  ): Promise<GetItemsResponse>;
  createContest(userId: string, data: CreateContestRequest): Promise<void>;
  updateContest(
    contestId: string,
    data: UpdateContestRequest,
  ): Promise<Contest>;
  removeContest(contestId: string): Promise<void>;
}
