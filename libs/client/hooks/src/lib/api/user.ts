import { UsersApi } from '@lets-choose/client/api';
import { QueryKeyFactory } from '@lets-choose/client/utils';
import { UserPublicDto } from '@lets-choose/common/dto';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useQuery, UseQueryOptions } from 'react-query';

export const userApi = new UsersApi();

export const userQueryKeys: QueryKeyFactory = {
  find: (username: string) => [{ scope: 'users', entity: username }],
};

type Config = {
  redirectTo?: string;
  redirectIfFound?: boolean;
};

export const useUserFindRedirect = (
  username: string,
  { redirectTo, redirectIfFound }: Config = {},
) => {
  const router = useRouter();

  return useQuery<AxiosResponse<UserPublicDto>, unknown, UserPublicDto>(
    userQueryKeys.find(username),
    () => userApi.find(username),
    {
      retry: 0,
      select: (response) => response.data,
      onSettled: (user) => {
        if (!redirectTo) return;

        if (
          // If redirectTo is set, redirect if the user was not found.
          (!redirectIfFound && !user) ||
          // If redirectIfFound is also set, redirect if the user was found
          (redirectIfFound && user)
        ) {
          router.push(redirectTo);
        }
      },
    },
  );
};

export const useCurrentUser = (config: Config = {}) => {
  return useUserFindRedirect('me', config);
};

export const useUserFind = (
  id: string,
  options: UseQueryOptions<
    AxiosResponse<UserPublicDto>,
    unknown,
    UserPublicDto
  > = {},
) => {
  return useQuery<AxiosResponse<UserPublicDto>, unknown, UserPublicDto>(
    userQueryKeys.find(id),
    () => userApi.find(id),
    {
      retry: 0,
      select: (response) => response.data,
      ...options,
    },
  );
};
