import {
  ContestDto,
  CreateContestDTO,
  GetContestsQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  UpdateContestDTO,
} from '@lets-choose/common/dto';

export interface IContestService {
  getContestsPaginate(query: GetContestsQuery): Promise<GetContestsResponse>;
  findContestById(id: string): Promise<ContestDto>;
  findContestsByAuthor(author: string): Promise<ContestDto[]>;
  getContestItemsPaginate(
    contestId: string,
    query: GetItemsQuery,
  ): Promise<GetItemsResponse>;
  createContest(userId: string, data: CreateContestDTO): Promise<ContestDto>;
  updateContest(contestId: string, data: UpdateContestDTO): Promise<ContestDto>;
  resetContest(contestId: string): Promise<ContestDto>;
  removeContest(contestId: string): Promise<void>;
}
