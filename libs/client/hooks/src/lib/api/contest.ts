import { ContestApi } from '@lets-choose/client/api';
import { AxiosResponse } from 'axios';
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  QueryKey,
} from 'react-query';
import {
  ContestDto,
  GetContestsQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  UpdateContestData,
} from '@lets-choose/common/dto';
import { UseQueryOptions } from 'react-query/types/react/types';

export const contestApi = new ContestApi();

export const useContestFind = (
  id: string,
  options: Omit<
    UseQueryOptions<AxiosResponse<ContestDto>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery(['contest', id] as QueryKey, () => contestApi.find(id), {
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
      getNextPageParam: (lastPage: AxiosResponse<GetContestsResponse>) => {
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
      getNextPageParam: (lastPage: AxiosResponse<GetItemsResponse>) => {
        try {
          const {
            data: { currentPage, totalPages },
          } = lastPage;
          if (currentPage < totalPages) return currentPage + 1;
          // eslint-disable-next-line no-empty
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
