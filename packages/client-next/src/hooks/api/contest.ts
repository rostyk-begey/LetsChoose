import { AxiosResponse } from 'axios';
import { useMutation, useQuery, useInfiniteQuery } from 'react-query';

import {
  Contest,
  CreateContestData,
  GetContestQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  HttpResponseMessageDto,
  UpdateContestData,
} from '@lets-choose/common';
import {
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from 'react-query/types/react/types';
import api from '../../providers/apiProvider';
import ROUTES from '../../utils/routes';

export const contestApi = () => {
  const baseURL = ROUTES.API.CONTESTS;
  const all = (params: GetContestQuery) =>
    api.get<GetContestsResponse>(baseURL, { params });
  const allItems = (id: string, params: GetItemsQuery) =>
    api.get<GetItemsResponse>(`${baseURL}/${id}/items`, { params });
  const find = (id: string) => api.get<Contest>(`${baseURL}/${id}`);
  const create = (data: CreateContestData) => api.post<Contest>(baseURL, data);
  const update = (
    id: string,
    data: Partial<Omit<UpdateContestData, 'items'>>,
  ) => api.post<HttpResponseMessageDto>(`${baseURL}/${id}`, data);
  const reset = (id: string) => api.post(`${baseURL}/${id}/reset`);
  const remove = (id: string) => api.delete(`${baseURL}/${id}`);
  return { all, allItems, find, create, update, remove, reset };
};

export const useContestFind = (
  id: string,
  options: UseQueryOptions<AxiosResponse<Contest>> = {},
) => {
  const { find } = contestApi();
  return useQuery(['contest', id], () => find(id), { retry: 0, ...options });
};

export const useContestAllInfinite = (
  params: Partial<GetContestQuery> = {},
  options: UseInfiniteQueryOptions<AxiosResponse<GetContestsResponse>> = {},
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
      ...options,
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
  options: UseInfiniteQueryOptions<AxiosResponse<GetItemsResponse>> = {},
) => {
  const queryParams: GetItemsQuery = {
    search: '',
    page: 1,
    perPage: 20,
    ...params,
  };
  const { allItems } = contestApi();
  return useInfiniteQuery<AxiosResponse<GetItemsResponse>>(
    ['contestItems', contestId, queryParams],
    ({ pageParam: page = 1 }) => allItems(contestId, { ...queryParams, page }),
    {
      ...options,
      getNextPageParam: (lastPage) => {
        try {
          const {
            data: { currentPage, totalPages },
          } = lastPage;
          if (currentPage < totalPages) return currentPage + 1;
        } catch (e) {}
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

export const useContestReset = (id: string) => {
  const { reset } = contestApi();
  return useMutation(() => reset(id));
};

export const useContestDelete = (id: string) => {
  const { remove } = contestApi();
  return useMutation(() => remove(id));
};
