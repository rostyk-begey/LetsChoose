import { ROUTES } from '@lets-choose/client/utils';
import {
  Contest,
  CreateContestData,
  GetContestsQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  HttpResponseMessageDto,
  UpdateContestData,
} from '@lets-choose/common/dto';

import { Api } from './api';

export class ContestApi extends Api {
  private readonly baseURL = ROUTES.API.CONTESTS;

  all = (params: GetContestsQuery) => {
    return this.api.get<GetContestsResponse>(this.baseURL, { params });
  };

  allItems = (id: string, params: GetItemsQuery) => {
    return this.api.get<GetItemsResponse>(`${this.baseURL}/${id}/items`, {
      params,
    });
  };

  find = (id: string) => {
    return this.api.get<Contest>(`${this.baseURL}/${id}`);
  };

  create = (data: CreateContestData) => {
    return this.api.post<Contest>(this.baseURL, data);
  };

  update = (id: string, data: Partial<Omit<UpdateContestData, 'items'>>) => {
    return this.api.post<HttpResponseMessageDto>(`${this.baseURL}/${id}`, data);
  };

  reset = (id: string) => {
    return this.api.post(`${this.baseURL}/${id}/reset`);
  };

  remove = (id: string) => {
    return this.api.delete(`${this.baseURL}/${id}`);
  };
}
