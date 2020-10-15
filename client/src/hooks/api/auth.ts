import {
  MutationResultPair,
  QueryResult,
  useMutation,
  useQuery,
} from 'react-query';
import { AxiosResponse } from 'axios';

import ROUTES from '../../utils/routes';
import api from '../../providers/apiProvider';
import { LoginResponseBody } from '../../../../server/controllers/user/types';
import { ResponseMessage } from '../../../../server/types';

const {
  LOGIN,
  REGISTER,
  CONFIRM_EMAIL,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} = ROUTES.API.AUTH;

interface LoginData {
  login: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  data: {
    password: string;
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAuthApi = () => {
  const login = (data: LoginData) => api.post<LoginResponseBody>(LOGIN, data);
  const register = (data: RegisterData) =>
    api.post<ResponseMessage>(REGISTER, data);
  const confirmEmail = (token: string) =>
    api.post<ResponseMessage>(`${CONFIRM_EMAIL}/${token}`);
  const forgotPassword = (data: ForgotPasswordData) =>
    api.post<ResponseMessage>(FORGOT_PASSWORD, data);
  const resetPassword = ({ token, data }: ResetPasswordData) =>
    api.post<ResponseMessage>(`${RESET_PASSWORD}/${token}`, data);
  return { login, register, forgotPassword, resetPassword, confirmEmail };
};

export const useApiLogin = (): MutationResultPair<
  AxiosResponse<LoginResponseBody>,
  LoginData,
  Error
> => {
  const { login } = useAuthApi();
  return useMutation(login);
};

export const useApiRegister = (): MutationResultPair<
  AxiosResponse<ResponseMessage>,
  RegisterData,
  Error
> => {
  const { register } = useAuthApi();
  return useMutation(register);
};

export const useApiForgotPassword = (): MutationResultPair<
  AxiosResponse<ResponseMessage>,
  ForgotPasswordData,
  Error
> => {
  const { forgotPassword } = useAuthApi();
  return useMutation(forgotPassword);
};

export const useApiResetPassword = (): MutationResultPair<
  AxiosResponse<ResponseMessage>,
  ResetPasswordData,
  Error
> => {
  const { resetPassword } = useAuthApi();
  return useMutation(resetPassword);
};

export const useApiConfirmEmail = (
  token: string,
  config = {},
): QueryResult<AxiosResponse<ResponseMessage>, ResetPasswordData> => {
  const { confirmEmail } = useAuthApi();
  return useQuery(['confirm_email', token], () => confirmEmail(token), {
    retry: 0,
    ...config,
  });
};
