import { AxiosResponse, AxiosError } from 'axios';
import {
  useMutation,
  useQuery,
  MutationFunction,
  UseMutationOptions,
} from 'react-query';

import {
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthGoogleLoginDto,
  AuthRegisterDto,
  HttpResponseMessageDto,
  AuthTokenDto,
} from '@lets-choose/common';
import api from '../../providers/apiProvider';
import ROUTES from '../../utils/routes';

const {
  LOGIN,
  LOGIN_GOOGLE,
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
  loginGoogle: (data: AuthGoogleLoginDto) =>
    api.post<AuthTokenDto>(LOGIN_GOOGLE, data),
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

export const useAxiosMutation = <
  TResult,
  TVariables,
  TErrorResult = HttpResponseMessageDto
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
