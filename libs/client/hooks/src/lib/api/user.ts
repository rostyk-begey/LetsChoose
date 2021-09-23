import { UsersApi } from '@lets-choose/client/api';
import Router from 'next/router';
import { useEffect } from 'react';
import { useMutation, useQuery, UseQueryOptions } from 'react-query';
import { AxiosResponse } from 'axios';
import { UserPublicDto } from '@lets-choose/common/dto';

const userApi = new UsersApi();

type Config = {
  redirectTo?: string;
  redirectIfFound?: boolean;
};

export const useUserFindRedirect = (
  username: string,
  { redirectTo, redirectIfFound }: Config = {},
  queryConfig: UseQueryOptions<AxiosResponse<UserPublicDto>> = {},
) => {
  const query = useQuery(['user', username], () => userApi.find(username), {
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
  config: Config = {},
  queryConfig: UseQueryOptions<AxiosResponse<UserPublicDto>> = {},
) => {
  return useUserFindRedirect('me', config, queryConfig);
};

export const useUserFind = (
  id: string,
  config: UseQueryOptions<AxiosResponse<UserPublicDto>> = {},
) => {
  return useQuery(['user', id], () => userApi.find(id), {
    retry: 0,
    ...config,
  });
};

export const useUserUpdateProfile = () => {
  return useMutation(userApi.updateProfile);
};

export const useUserDeleteProfile = () => {
  return useMutation(userApi.deleteProfile);
};
