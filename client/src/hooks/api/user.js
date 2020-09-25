import { useMutation, useQuery } from 'react-query';

import api from 'app/providers/apiProvider';
import ROUTES from 'app/utils/routes';

export const useUserApi = () => {
  const baseURL = ROUTES.API.USERS;
  const find = (id) => api.get(`${baseURL}/${id}`);
  // const update = (id, data) => api.post(`${baseURL}/${id}`, data);
  // const remove = (id) => api.delete(`${baseURL}/${id}`);
  return { find };
};

export const useUserMe = () => {
  const baseURL = ROUTES.API.USERS;
  const find = (id) => api.get(`${baseURL}/${id}`);
  // const update = (id, data) => api.post(`${baseURL}/${id}`, data);
  // const remove = (id) => api.delete(`${baseURL}/${id}`);
  return { find };
};

export const useUserFind = (id, config = {}) => {
  const { find } = useUserApi();
  return useQuery(['user', id], () => find(id), { retry: 0, ...config });
};
