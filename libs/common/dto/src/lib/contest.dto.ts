import { UserDto } from './user.dto';

export abstract class ContestItem {
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

export abstract class Contest {
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

export abstract class PaginationQuery {
  page: number;
  perPage: number;
}

export abstract class SearchQuery {
  search: string;
}

export abstract class FindParams {
  id: string;
}

export abstract class GetContestsQuery implements SearchQuery, PaginationQuery {
  author: string;
  sortBy: '' | keyof typeof SORT_OPTIONS;
  search: string;
  page: number;
  perPage: number;
  nextCursor?: string;
}

abstract class PaginatedResponse<T extends any> {
  items: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

export abstract class GetContestsResponse extends PaginatedResponse<Contest> {}

export abstract class GetItemsQuery implements SearchQuery, PaginationQuery {
  search: string;
  page: number;
  perPage: number;
}

export abstract class GetItemsResponse extends PaginatedResponse<ContestItem> {}

export abstract class CreateContestDTO {
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
