import { Request, Response } from 'express';
import { Contest } from '../../models/Contest';
import { ContestItem } from '../../models/ContestItem';
import { ResponseMessage } from '../../types';

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
  sortBy: keyof typeof SORT_OPTIONS;
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

export interface IContestController {
  get(
    req: Request<never, any, any, GetQuery>,
    res: Response<GetResponse>,
  ): Promise<void>;
  find(req: Request<FindParams>, res: Response<Contest>): Promise<void>;
  getItems(
    req: Request<FindParams, any, any, GetItemsQuery>,
    res: Response<GetItemsResponse>,
  ): Promise<void>;
  create(
    req: Request<never, any, CreateBody>,
    res: Response<ResponseMessage>,
  ): Promise<void>;
  update(
    req: Request<FindParams, any, Omit<CreateBody, 'items'>>,
    res: Response,
  ): Promise<void>;
  remove(
    req: Request<FindParams>,
    res: Response<ResponseMessage>,
  ): Promise<void>;
}
