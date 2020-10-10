import { Request, Response } from 'express';
import { IContest } from '../../models/Contest';
import { IContestItem } from '../../models/ContestItem';
import { ResponseMessage } from '../../types';

interface PaginationQuery {
  page: number;
  perPage: number;
}

interface SearchQuery {
  search: string;
}

interface FindParams {
  id: string;
}

interface GetQuery extends SearchQuery, PaginationQuery {
  author: string;
  sortBy: keyof typeof SORT_OPTIONS;
}

interface GetResponse {
  contests: IContest[];
  totalPages: number;
  currentPage: number;
}

interface GetItemsQuery extends SearchQuery, PaginationQuery {}

interface GetItemsResponse {
  items: IContestItem[];
  totalPages: number;
  currentPage: number,
}

interface CreateBody {
  title: string,
  excerpt: string,
  items: Pick<IContestItem, 'title'>[]
}

export enum SORT_OPTIONS {
  POPULAR = 'games',
  NEWEST = '_id',
}

export interface ISortOptions extends Partial<Record<keyof typeof SORT_OPTIONS, number>> {
  score?: number;
}

export interface IContestController {
  get(req: Request<{}, any, any, GetQuery>, res: Response<GetResponse>): Promise<void>;
  find(req: Request<FindParams>, res: Response<IContest>): Promise<void>;
  getItems(req: Request<FindParams, any, any, GetItemsQuery>, res: Response<GetItemsResponse>): Promise<void>;
  create(req: Request<{}, any, CreateBody>, res: Response<ResponseMessage>): Promise<void>;
  update(req: Request<FindParams, any, Omit<CreateBody, 'items'>>, res: Response): Promise<void>;
  remove(req: Request<FindParams>, res: Response<ResponseMessage>): Promise<void>;
}