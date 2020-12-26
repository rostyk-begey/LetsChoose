import { QueryResult, useQuery } from 'react-query';
import { AxiosResponse } from 'axios';

import api from '../../providers/apiProvider';
import ROUTES from '../../utils/routes';
import { UserDto } from '@lets-choose/common';

export const useUserApi = () => {
  const baseURL = ROUTES.API.USERS;
  const find = (id: string) => api.get<UserDto>(`${baseURL}/${id}`);
  // const update = (id, data) => api.post(`${baseURL}/${id}`, data);
  // const remove = (id) => api.delete(`${baseURL}/${id}`);
  return { find };
};

export const useUserFind = (
  id: string,
  config = {},
): QueryResult<AxiosResponse<UserDto>> => {
  const { find } = useUserApi();
  return useQuery(['user', id], () => find(id), {
    retry: 0,
    ...config,
  });
};
