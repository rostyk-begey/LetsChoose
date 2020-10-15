import { QueryResult, useQuery } from 'react-query';
import { AxiosResponse } from 'axios';

import api from 'app/providers/apiProvider';
import ROUTES from 'app/utils/routes';
import { User } from '../../../../server/models/User';

export const useUserApi = () => {
  const baseURL = ROUTES.API.USERS;
  const find = (id: string) => api.get<User>(`${baseURL}/${id}`);
  // const update = (id, data) => api.post(`${baseURL}/${id}`, data);
  // const remove = (id) => api.delete(`${baseURL}/${id}`);
  return { find };
};

export const useUserFind = (
  id: string,
  config = {},
): QueryResult<AxiosResponse<User>> => {
  const { find } = useUserApi();
  return useQuery(['user', id], () => find(id), {
    retry: 0,
    ...config,
  });
};
