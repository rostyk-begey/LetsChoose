import { UserDto } from './user.dto';

export interface ContestItem {
  _id: string;
  readonly id: string;
  image: string;
  title: string;
  games: number;
  compares: number;
  wins: number;
  finalWins: number;
  contestId: string | Contest;
}

export interface Contest {
  _id: string;
  id: string;
  thumbnail: string;
  title: string;
  excerpt: string;
  author: UserDto | string;
  games: number;
  items: ContestItem[];
  createdAt: string;
}

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

interface PaginatedResponse {
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

export interface GetContestsResponse extends PaginatedResponse {
  contests: Contest[];
}

export interface GetItemsQuery extends SearchQuery, PaginationQuery {}

export interface GetItemsResponse extends PaginatedResponse {
  items: ContestItem[];
}

export interface CreateContestDTO {
  title: string;
  excerpt: string;
  items: Pick<ContestItem, 'title'>[];
  files: any[];
}

export type CreateContestData = Omit<CreateContestDTO, 'files'>;

export type UpdateContestDTO = Omit<CreateContestDTO, 'items'>;

export type UpdateContestData = Partial<Omit<UpdateContestDTO, 'files'>>;

export interface ISortOptions
  extends Partial<Record<keyof typeof SORT_OPTIONS, number>> {
  score?: number;
}
