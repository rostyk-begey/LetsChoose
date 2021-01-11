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

export const useContestApi = () => {
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
  const { find } = useContestApi();
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
  const { all } = useContestApi();
  return useInfiniteQuery<
    { data: GetContestsResponse },
    [string, GetContestQuery],
    any
  >(
    ['contests', queryParams],
    (key, _, page = 1) => all({ ...queryParams, page }),
    {
      ...config,
      getFetchMore: (lastPage) => {
        console.log(lastPage.data);
        const {
          data: { currentPage, totalPages },
        } = lastPage;
        if (currentPage === totalPages) return false;
        return currentPage + 1;
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
  const { allItems } = useContestApi();
  return useInfiniteQuery(
    ['contestItems', queryParams],
    (key, _, page: number) => allItems(contestId, { ...queryParams, page }),
    {
      ...config,
      getFetchMore: ({ data: { currentPage, totalPages } }) => {
        if (currentPage === totalPages) return false;
        return currentPage + 1;
      },
    },
  );
};

export const useContestCreate = () => {
  const { create } = useContestApi();
  return useMutation(create);
};

export const useContestUpdate = (id: string) => {
  const { update } = useContestApi();
  return useMutation((data: UpdateContestData) => update(id, data));
};
