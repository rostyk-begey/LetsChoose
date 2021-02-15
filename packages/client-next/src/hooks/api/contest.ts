import { AxiosResponse } from 'axios';
import { useMutation, useQuery, useInfiniteQuery } from 'react-query';

import {
  Contest,
  CreateContestData,
  GetContestQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  UpdateContestData,
} from '@lets-choose/common';
import api from '../../providers/apiProvider';
import ROUTES from '../../utils/routes';
import { ResponseMessage } from '../../../../../legacy/server/types';

export const contestApi = () => {
  const baseURL = ROUTES.API.CONTESTS;
  const all = (params: GetContestQuery) =>
    api.get<GetContestsResponse>(baseURL, { params });
  const allItems = (id: string, params: GetItemsQuery) =>
    api.get<GetItemsResponse>(`${baseURL}/${id}/items`, { params });
  const find = (id: string) => api.get<Contest>(`${baseURL}/${id}`);
  const create = (data: CreateContestData) =>
    api.post<ResponseMessage>(baseURL, data);
  const update = (
    id: string,
    data: Partial<Omit<UpdateContestData, 'items'>>,
  ) => api.post<ResponseMessage>(`${baseURL}/${id}`, data);
  const remove = (id: string) => api.delete(`${baseURL}/${id}`);
  return { all, allItems, find, create, update, remove };
};

export const useContestFind = (id: string, config = {}) => {
  const { find } = contestApi();
  return useQuery(['contest', id], () => find(id), { retry: 0, ...config });
};

export const useContestAllInfinite = (
  params: Partial<GetContestQuery> = {},
  config = {},
) => {
  const queryParams: GetContestQuery = {
    author: '',
    search: '',
    sortBy: 'POPULAR',
    page: 1,
    perPage: 10,
    ...params,
  };
  const { all } = contestApi();
  return useInfiniteQuery<AxiosResponse<GetContestsResponse>>(
    ['contests', queryParams],
    ({ pageParam: page = 1 }) => all({ ...queryParams, page }),
    {
      ...config,
      getNextPageParam: (lastPage) => {
        const {
          data: { currentPage, totalPages },
        } = lastPage;
        if (currentPage < totalPages) return currentPage + 1;
        return undefined;
      },
    },
  );
};

export const useContestItemsInfinite = (
  contestId: string,
  params: Partial<GetItemsQuery> = {},
  config = {},
) => {
  const queryParams: GetItemsQuery = {
    search: '',
    page: 1,
    perPage: 20,
    ...params,
  };
  const { allItems } = contestApi();
  return useInfiniteQuery<AxiosResponse<GetItemsResponse>>(
    ['contestItems', queryParams],
    ({ pageParam: page = 1 }) => allItems(contestId, { ...queryParams, page }),
    {
      ...config,
      getNextPageParam: (lastPage) => {
        const {
          data: { currentPage, totalPages },
        } = lastPage;
        if (currentPage < totalPages) return currentPage + 1;
        return undefined;
      },
    },
  );
};

export const useContestCreate = () => {
  const { create } = contestApi();
  return useMutation(create);
};

export const useContestUpdate = (id: string) => {
  const { update } = contestApi();
  return useMutation((data: UpdateContestData) => update(id, data));
};

export const useContestDelete = (id: string) => {
  const { remove } = contestApi();
  return useMutation(() => remove(id));
};
