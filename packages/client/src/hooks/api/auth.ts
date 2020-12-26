import { useMutation, useQuery } from 'react-query';

import ROUTES from '../../utils/routes';
import api from '../../providers/apiProvider';
import {
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
  HttpResponseMessageDto,
  AuthTokenDto,
} from '@lets-choose/common';

const {
  LOGIN,
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

export const useAuthApi = () => {
  const login = (data: AuthLoginDto) => api.post<AuthTokenDto>(LOGIN, data);
  const register = (data: AuthRegisterDto) =>
    api.post<HttpResponseMessageDto>(REGISTER, data);
  const confirmEmail = (token: string) =>
    api.post<HttpResponseMessageDto>(`${CONFIRM_EMAIL}/${token}`);
  const forgotPassword = (data: AuthForgotPasswordDto) =>
    api.post<HttpResponseMessageDto>(FORGOT_PASSWORD, data);
  const resetPassword = ({ token, data }: ResetPasswordData) =>
    api.post<HttpResponseMessageDto>(`${RESET_PASSWORD}/${token}`, data);
  return { login, register, forgotPassword, resetPassword, confirmEmail };
};

export const useApiLogin = () => {
  const { login } = useAuthApi();
  return useMutation(login);
};

export const useApiRegister = () => {
  const { register } = useAuthApi();
  return useMutation(register);
};

export const useApiForgotPassword = () => {
  const { forgotPassword } = useAuthApi();
  return useMutation(forgotPassword);
};

export const useApiResetPassword = () => {
  const { resetPassword } = useAuthApi();
  return useMutation(resetPassword);
};

export const useApiConfirmEmail = (token: string, config = {}) => {
  const { confirmEmail } = useAuthApi();
  return useQuery(['confirm_email', token], () => confirmEmail(token), {
    retry: 0,
    ...config,
  });
};
