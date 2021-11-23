import { ContestApi } from '@lets-choose/client/api';
import { QueryKeyFactory } from '@lets-choose/client/utils';
import { AxiosResponse } from 'axios';
import {
  useQuery,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from 'react-query';
import {
  ContestDto,
  GetContestsQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
} from '@lets-choose/common/dto';
import { UseQueryOptions } from 'react-query';

export const contestApi = new ContestApi();

export const contestQueryKeys: QueryKeyFactory = {
  all: (queryParams: unknown) => [
    { scope: 'contests', entity: 'list', queryParams },
  ],
  allItems: (contestId: string, queryParams: unknown) => [
    { scope: 'contestItems', entity: 'list', contestId, queryParams },
  ],
  find: (id: string) => [{ scope: 'contests', entity: id }],
};

export const useContestFind = (
  id: string,
  options: Omit<
    UseQueryOptions<AxiosResponse<ContestDto>, unknown, ContestDto>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<AxiosResponse<ContestDto>, unknown, ContestDto>(
    contestQueryKeys.find(id),
    () => contestApi.find(id),
    {
      retry: 0,
      select: (response) => response.data,
      ...options,
    },
  );
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
    contestQueryKeys.all(queryParams),
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
    contestQueryKeys.allItems(contestId, queryParams),
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
