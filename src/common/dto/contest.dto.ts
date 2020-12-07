import { ContestItem } from '../../server/modules/contest/contest-item.schema';
import { Contest } from '../../server/modules/contest/contest.schema';

export enum SORT_OPTIONS {
  POPULAR = 'games',
  NEWEST = '_id',
}

export interface PaginationQuery {
  page: number;
  perPage: number;
}

export interface SearchQuery {
  search: string;
}

export interface FindParams {
  id: string;
}

export interface GetContestQuery extends SearchQuery, PaginationQuery {
  author: string;
  sortBy: '' | keyof typeof SORT_OPTIONS;
}

export interface GetContestsResponse {
  contests: Contest[];
  totalPages: number;
  currentPage: number;
}

export interface GetItemsQuery extends SearchQuery, PaginationQuery {}

export interface GetItemsResponse {
  items: ContestItem[];
  totalPages: number;
  currentPage: number;
}

export interface CreateContestRequest {
  title: string;
  excerpt: string;
  items: Pick<ContestItem, 'title'>[];
  files: any[];
}

export type UpdateContestRequest = Omit<CreateContestRequest, 'items'>;

export interface ISortOptions
  extends Partial<Record<keyof typeof SORT_OPTIONS, number>> {
  score?: number;
}
