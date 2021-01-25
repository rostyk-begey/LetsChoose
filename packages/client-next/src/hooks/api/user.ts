import Router from 'next/router';
import { useEffect } from 'react';
import { QueryResult, QueryConfig, useQuery } from 'react-query';
import { AxiosResponse } from 'axios';

import { UserDto } from '@lets-choose/common';
import api from '../../providers/apiProvider';
import ROUTES from '../../utils/routes';

export const useUserApi = () => {
  const baseURL = ROUTES.API.USERS;
  const find = (id: string) => api.get<UserDto>(`${baseURL}/${id}`);
  // const update = (id, data) => api.post(`${baseURL}/${id}`, data);
  // const remove = (id) => api.delete(`${baseURL}/${id}`);
  return { find };
};

export const useUserFindRedirect = (
  username,
  {
    redirectTo,
    redirectIfFound,
  }: {
    redirectTo?: string;
    redirectIfFound?: boolean;
  },
  queryConfig: QueryConfig<AxiosResponse<UserDto>> = {},
): QueryResult<AxiosResponse<UserDto>> => {
  const { find } = useUserApi();
  const query = useQuery(['user', username], () => find(username), {
    retry: 0,
    ...queryConfig,
  });
  const { data: response, isLoading } = query;

  const user = response?.data;
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo || isLoading) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (!redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, isLoading, hasUser]);

  return query;
};

export const useCurrentUser = (
  config: {
    redirectTo?: string;
    redirectIfFound?: boolean;
  },
  queryConfig: QueryConfig<AxiosResponse<UserDto>> = {},
): QueryResult<AxiosResponse<UserDto>> => {
  return useUserFindRedirect('me', config, queryConfig);
};

export const useUserFind = (
  id: string,
  config: QueryConfig<AxiosResponse<UserDto>> = {},
): QueryResult<AxiosResponse<UserDto>> => {
  const { find } = useUserApi();
  return useQuery(['user', id], () => find(id), {
    retry: 0,
    ...config,
  });
};
