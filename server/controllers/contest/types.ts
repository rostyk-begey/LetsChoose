import { Contest } from '../../models/Contest';
import { ContestItem } from '../../models/ContestItem';

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

export interface GetQuery extends SearchQuery, PaginationQuery {
  author: string;
  sortBy: '' | keyof typeof SORT_OPTIONS;
}

export interface GetResponse {
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

export interface CreateBody {
  title: string;
  excerpt: string;
  items: Pick<ContestItem, 'title'>[];
}

export interface ISortOptions
  extends Partial<Record<keyof typeof SORT_OPTIONS, number>> {
  score?: number;
}
