import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  MutationResultPair,
  InfiniteQueryResult,
} from 'react-query';
import { AxiosResponse } from 'axios';

import api from '../../providers/apiProvider';
import ROUTES from '../../utils/routes';
import {
  GetQuery,
  GetItemsQuery,
  GetResponse,
  GetItemsResponse,
  CreateBody,
} from '../../../../server/controllers/contest/types';
import { ResponseMessage } from '../../../../server/types';
import { ContestItem } from '../../../../server/models/Contest';

export const useContestApi = () => {
  const baseURL = ROUTES.API.CONTESTS;
  const all = (params: GetQuery) => api.get<GetResponse>(baseURL, { params });
  const allItems = (id: string, params: GetItemsQuery) =>
    api.get<GetItemsResponse>(`${baseURL}/${id}/items`, { params });
  const find = (id: string) => api.get<ContestItem>(`${baseURL}/${id}`);
  const create = (data: CreateBody) => api.post<ResponseMessage>(baseURL, data);
  const update = (id: string, data: Partial<Omit<CreateBody, 'items'>>) =>
    api.post<ResponseMessage>(`${baseURL}/${id}`, data);
  const remove = (id: string) => api.delete(`${baseURL}/${id}`);
  return { all, allItems, find, create, update, remove };
};

export const useContestFind = (id: string, config = {}) => {
  const { find } = useContestApi();
  return useQuery(['contest', id], () => find(id), { retry: 0, ...config });
};

export const useContestAllInfinite = (
  params: Partial<GetQuery> = {},
  config = {},
) => {
  const queryParams: GetQuery = {
    author: '',
    search: '',
    sortBy: 'POPULAR',
    page: 1,
    perPage: 10,
    ...params,
  };
  const { all } = useContestApi();
  return useInfiniteQuery<{ data: GetResponse }, [string, GetQuery], number>(
    ['contests', queryParams],
    (key, _, page = 1) => all({ ...queryParams, page }),
    {
      ...config,
      getFetchMore: ({ data: { currentPage, totalPages } }) => {
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
): InfiniteQueryResult<AxiosResponse<GetItemsResponse>, number> => {
  const queryParams: GetItemsQuery = {
    search: '',
    page: 1,
    perPage: 20,
    ...params,
  };
  const { allItems } = useContestApi();
  return useInfiniteQuery(
    ['contestItems', queryParams],
    (key, _, page = 1) => allItems(contestId, { ...queryParams, page }),
    {
      ...config,
      getFetchMore: ({ data: { currentPage, totalPages } }) => {
        if (currentPage === totalPages) return false;
        return currentPage + 1;
      },
    },
  );
};

export const useContestCreate = (): MutationResultPair<
  AxiosResponse<ResponseMessage>,
  any, //CreateBody,
  Error
> => {
  const { create } = useContestApi();
  return useMutation(create);
};

export const useContestUpdate = (
  id: string,
): MutationResultPair<
  AxiosResponse<ResponseMessage>,
  any, //Partial<Omit<CreateBody, 'items'>>,
  Error
> => {
  const { update } = useContestApi();
  return useMutation((data) => update(id, data));
};
