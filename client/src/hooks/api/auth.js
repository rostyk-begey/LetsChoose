import { useMutation, useQuery } from 'react-query';

import ROUTES from 'app/utils/routes';
import api from 'app/providers/apiProvider';

const {
  INDEX,
  LOGIN,
  REGISTER,
  CONFIRM_EMAIL,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} = ROUTES.API.AUTH;

export const useAuthApi = () => {
  const baseURL = INDEX;
  const auth = () => api.post('/');
  const login = (data) => api.post(`${baseURL}/${LOGIN}`, data);
  const register = (data) => api.post(`${baseURL}/${REGISTER}`, data);
  const confirmEmail = (token) =>
    api.post(`${baseURL}/${CONFIRM_EMAIL}/${token}`);
  const forgotPassword = (data) =>
    api.post(`${baseURL}/${FORGOT_PASSWORD}`, data);
  const resetPassword = ({ token, data }) =>
    api.post(`${baseURL}/${RESET_PASSWORD}/${token}`, data);
  return { auth, login, register, forgotPassword, resetPassword, confirmEmail };
};

export const useApiAuth = () => {
  try {
    const { auth } = useAuthApi();
    return useMutation(auth);
  } catch (e) {
    console.log(e);
  }
};

export const useApiLogin = () => {
  try {
    const { login } = useAuthApi();
    return useMutation(login);
  } catch (e) {
    console.log(e);
  }
};

export const useApiRegister = () => {
  try {
    const { auth } = useAuthApi();
    return useMutation(auth);
  } catch (e) {
    console.log(e);
  }
};

export const useApiForgotPassword = () => {
  try {
    const { forgotPassword } = useAuthApi();
    return useMutation(forgotPassword);
  } catch (e) {
    console.log(e);
  }
};

export const useApiResetPassword = () => {
  try {
    const { resetPassword } = useAuthApi();
    return useMutation(resetPassword);
  } catch (e) {
    console.log(e);
  }
};

export const useApiConfirmEmail = (token, config = {}) => {
  const { confirmEmail } = useAuthApi();
  return useQuery(['confirm_email', token], () => confirmEmail(token), {
    retry: 0,
    ...config,
  });
};
