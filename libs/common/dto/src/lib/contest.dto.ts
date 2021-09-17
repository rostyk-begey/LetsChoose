import { UserDto } from './user.dto';

export abstract class ContestItemDto {
  _id: string;
  readonly id: string;
  image: string;
  title: string;
  games: number;
  compares: number;
  wins: number;
  finalWins: number;
  contestId: string | ContestDto;
}

export abstract class ContestDto {
  _id: string;
  id: string;
  thumbnail: string;
  title: string;
  excerpt: string;
  author: UserDto | string;
  games: number;
  items: ContestItemDto[];
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

abstract class PaginatedResponse<T extends unknown> {
  items: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

export abstract class GetContestsResponse extends PaginatedResponse<ContestDto> {}

export abstract class GetItemsQuery implements SearchQuery, PaginationQuery {
  search: string;
  page: number;
  perPage: number;
}

export abstract class GetItemsResponse extends PaginatedResponse<ContestItemDto> {}

export abstract class CreateContestDto {
  title: string;
  excerpt: string;
  items: Pick<ContestItemDto, 'title'>[];
  files: unknown[];
}

export type CreateContestData = Omit<CreateContestDto, 'files'>;

export type UpdateContestDTO = Omit<CreateContestDto, 'items'>;

export type UpdateContestData = Partial<Omit<UpdateContestDTO, 'files'>>;

export interface ISortOptions
  extends Partial<Record<keyof typeof SORT_OPTIONS, number>> {
  score?: number;
}
