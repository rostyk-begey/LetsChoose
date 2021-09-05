import { AuthApi } from '@lets-choose/client/api';
import { AxiosResponse, AxiosError } from 'axios';
import {
  useMutation,
  useQuery,
  MutationFunction,
  UseMutationOptions,
} from 'react-query';
import { HttpResponseMessageDto } from '@lets-choose/common/dto';

export const useAxiosMutation = <
  TResult,
  TVariables,
  TErrorResult = HttpResponseMessageDto,
>(
  mutationFn: MutationFunction<AxiosResponse<TResult>, TVariables>,
  config?: UseMutationOptions<
    AxiosResponse<TResult>,
    AxiosError<TErrorResult>,
    TVariables
  >,
) => {
  return useMutation<
    AxiosResponse<TResult>,
    AxiosError<TErrorResult>,
    TVariables
  >(mutationFn, config);
};

export const authApi = new AuthApi();

export const useApiLogin = () => {
  return useMutation(authApi.login);
};

export const useApiRegister = () => {
  return useAxiosMutation(authApi.register);
};

export const useApiForgotPassword = () => useMutation(authApi.forgotPassword);

export const useApiResetPassword = () => useMutation(authApi.resetPassword);

export const useApiConfirmEmail = (token: string, config = {}) => {
  return useQuery(['confirm_email', token], () => authApi.confirmEmail(token), {
    retry: 0,
    ...config,
  });
};

export const useUpdateUserPassword = () => {
  return useMutation(authApi.updatePassword);
};
