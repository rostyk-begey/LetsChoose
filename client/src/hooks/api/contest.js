import { useContext } from 'react';
import { useMutation, useQuery, useInfiniteQuery } from 'react-query';

import AuthContext from 'app/context/AuthContext';
import axios from 'axios';
import ROUTES from 'app/utils/routes';

export const useContestApi = () => {
  const auth = useContext(AuthContext);
  const api = axios.create({
    baseURL: ROUTES.API.CONTESTS,
    headers: {
      Authorization: `Bearer ${auth.token}`,
      accepts: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });
  const all = (params) => api.get('/', { params });
  const find = (id) => api.get(`/${id}`);
  const create = (data) => api.post('/', data);
  const update = (id, data) => api.post(`/${id}`, data);
  const remove = (id) => api.delete(`/${id}`);
  return { all, find, create, update, remove };
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
      retry: 0,
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
