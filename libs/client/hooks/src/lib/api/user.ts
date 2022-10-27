import { UsersApi } from '@lets-choose/client/api';
import { QueryKeyFactory } from '@lets-choose/client/utils';
import { UserPublicDto } from '@lets-choose/common/dto';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const userApi = new UsersApi();

export const userQueryKeys: QueryKeyFactory = {
  session: () => [{ scope: 'users', entity: 'session' }],
  find: (username: string) => [{ scope: 'users', entity: username }],
};

export type UseCurrentUserConfig = {
  redirectTo?: string;
  redirectIfFound?: boolean;
} & UseQueryOptions<AxiosResponse<UserPublicDto>, unknown, UserPublicDto>;

export const useCurrentUser = ({
  redirectTo,
  redirectIfFound,
  ...config
}: UseCurrentUserConfig = {}) => {
  const router = useRouter();

  return useQuery<AxiosResponse<UserPublicDto>, unknown, UserPublicDto>(
    userQueryKeys.session(),
    userApi.session,
    {
      ...config,
      retry: 0,
      select: (response) => response.data,
      onSettled: (user, error) => {
        if (config.onSettled) config.onSettled(user, error);

        if (!redirectTo) {
          return;
        }

        if (
          // If redirectTo is set, redirect if the user was not found.
          (!redirectIfFound && !user) ||
          // If redirectIfFound is also set, redirect if the user was found
          (redirectIfFound && !!user)
        ) {
          router.push(redirectTo);
        }
      },
    },
  );
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
