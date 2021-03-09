import {
  Contest,
  CreateContestDTO,
  GetContestQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  UpdateContestDTO,
} from '@lets-choose/common';

export interface IContestService {
  getContestsPaginate(query: GetContestQuery): Promise<GetContestsResponse>;
  findContestById(id: string): Promise<Contest>;
  findContestsByAuthor(author: string): Promise<Contest[]>;
  getContestItemsPaginate(
    contestId: string,
    query: GetItemsQuery,
  ): Promise<GetItemsResponse>;
  createContest(userId: string, data: CreateContestDTO): Promise<Contest>;
  updateContest(contestId: string, data: UpdateContestDTO): Promise<Contest>;
  removeContest(contestId: string): Promise<void>;
}
