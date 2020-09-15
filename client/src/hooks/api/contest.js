import { useContext } from 'react';
import { useMutation, useQuery } from 'react-query';

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
  return { all, find, create, remove };
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

export const useContestCreate = () => {
  try {
    const { create } = useContestApi();
    return useMutation(create);
  } catch (e) {
    console.log(e);
  }
};

export const useContestUpdate = () => {
  try {
    const { update } = useContestApi();
    return useMutation(update);
  } catch (e) {
    console.log(e);
  }
};
