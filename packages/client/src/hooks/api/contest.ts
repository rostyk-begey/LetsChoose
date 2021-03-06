import { AxiosResponse } from 'axios';
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from 'react-query';
import {
  Contest,
  GetContestsQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  UpdateContestData,
} from '@lets-choose/common';

import ContestApi from '../../api/contest.api';

export const contestApi = new ContestApi();

export const useContestFind = (
  id: string,
  options: UseQueryOptions<AxiosResponse<Contest>> = {},
) => {
  return useQuery(['contest', id], () => contestApi.find(id), {
    retry: 0,
    ...options,
  });
};

export const useContestAllInfinite = (
  params: Partial<GetContestsQuery> = {},
  options: UseInfiniteQueryOptions<AxiosResponse<GetContestsResponse>> = {},
) => {
  const queryParams: GetContestsQuery = {
    author: '',
    search: '',
    sortBy: 'POPULAR',
    page: 1,
    perPage: 10,
    ...params,
  };
  return useInfiniteQuery<AxiosResponse<GetContestsResponse>>(
    ['contests', queryParams],
    ({ pageParam: page = 1 }) => contestApi.all({ ...queryParams, page }),
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
  return useInfiniteQuery<AxiosResponse<GetItemsResponse>>(
    ['contestItems', contestId, queryParams],
    ({ pageParam: page = 1 }) =>
      contestApi.allItems(contestId, { ...queryParams, page }),
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
  return useMutation(contestApi.create);
};

export const useContestUpdate = (id: string) => {
  return useMutation((data: UpdateContestData) => contestApi.update(id, data));
};

export const useContestReset = (id: string) => {
  return useMutation(() => contestApi.reset(id));
};

export const useContestDelete = (id: string) => {
  return useMutation(() => contestApi.remove(id));
};
