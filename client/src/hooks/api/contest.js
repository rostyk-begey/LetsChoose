import { useMutation, useQuery, useInfiniteQuery } from 'react-query';

import api from 'app/providers/apiProvider';
import ROUTES from 'app/utils/routes';

export const useContestApi = () => {
  const baseURL = ROUTES.API.CONTESTS;
  const all = (params) => api.get(baseURL, { params });
  const allItems = (id, params) =>
    api.get(`${baseURL}/${id}/items`, { params });
  const find = (id) => api.get(`${baseURL}/${id}`);
  const create = (data) => api.post(baseURL, data);
  const update = (id, data) => api.post(`${baseURL}/${id}`, data);
  const remove = (id) => api.delete(`${baseURL}/${id}`);
  return { all, allItems, find, create, update, remove };
};

export const useContestFind = (id, config = {}) => {
  const { find } = useContestApi();
  return useQuery(['contest', id], () => find(id), { retry: 0, ...config });
};

export const useContestAll = (params = {}, config = {}) => {
  const { all } = useContestApi();
  return useQuery(['contests', params], () => all(params), {
    retry: 0,
    ...config,
  });
};

export const useContestAllInfinite = (params = {}, config = {}) => {
  const queryParams = {
    author: '',
    search: '',
    sortBy: 'POPULAR',
    page: 1,
    perPage: 10,
    ...params,
  };
  const { all } = useContestApi();
  return useInfiniteQuery(
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
  contestId,
  params = {},
  config = {},
) => {
  const queryParams = {
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

export const useContestCreate = () => {
  try {
    const { create } = useContestApi();
    return useMutation(create);
  } catch (e) {
    console.log(e);
  }
};

export const useContestUpdate = (id) => {
  try {
    const { update } = useContestApi();
    return useMutation((data) => update(id, data));
  } catch (e) {
    console.log(e);
  }
};
