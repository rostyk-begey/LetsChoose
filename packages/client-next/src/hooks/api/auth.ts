import { AxiosResponse, AxiosError } from 'axios';
import {
  useMutation,
  useQuery,
  MutationFunction,
  MutationConfig,
} from 'react-query';

import {
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthRegisterDto,
  HttpResponseMessageDto,
  AuthTokenDto,
} from '@lets-choose/common';
import api from '../../providers/apiProvider';
import ROUTES from '../../utils/routes';

const {
  LOGIN,
  LOGOUT,
  REGISTER,
  CONFIRM_EMAIL,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} = ROUTES.API.AUTH;

// TODO refactor
interface ResetPasswordData {
  token: string;
  data: {
    password: string;
  };
}

export const authApi = {
  login: (data: AuthLoginDto) => api.post<AuthTokenDto>(LOGIN, data),
  logout: () => api.post<HttpResponseMessageDto>(LOGOUT, {}),
  register: (data: AuthRegisterDto) =>
    api.post<HttpResponseMessageDto>(REGISTER, data),
  confirmEmail: (token: string) =>
    api.post<HttpResponseMessageDto>(`${CONFIRM_EMAIL}/${token}`),
  forgotPassword: (data: AuthForgotPasswordDto) =>
    api.post<HttpResponseMessageDto>(FORGOT_PASSWORD, data),
  resetPassword: ({ token, data }: ResetPasswordData) =>
    api.post<HttpResponseMessageDto>(`${RESET_PASSWORD}/${token}`, data),
};

const useAxiosMutation = <TResult, TVariables>(
  mutationFn: MutationFunction<AxiosResponse<TResult>, TVariables>,
  config?: MutationConfig<
    AxiosResponse<TResult>,
    AxiosError<TResult>,
    TVariables
  >,
) =>
  useMutation<AxiosResponse<TResult>, AxiosError<TResult>, TVariables>(
    mutationFn,
    config,
  );

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
