import { UsersApi } from '@lets-choose/client/api';
import Router from 'next/router';
import { useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';

const userApi = new UsersApi();

type Config = {
  redirectTo?: string;
  redirectIfFound?: boolean;
};

export const useUserFindRedirect = (
  username: string,
  { redirectTo, redirectIfFound }: Config = {},
) => {
  const query = useQuery(['user', username], () => userApi.find(username), {
    retry: 0,
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

export const useCurrentUser = (config: Config = {}) => {
  return useUserFindRedirect('me', config);
};

export const useUserFind = (id: string) => {
  return useQuery(['user', id], () => userApi.find(id), {
    retry: 0,
  });
};

export const useUserUpdateProfile = () => {
  return useMutation(userApi.updateProfile);
};

export const useUserDeleteProfile = () => {
  return useMutation(userApi.deleteProfile);
};
