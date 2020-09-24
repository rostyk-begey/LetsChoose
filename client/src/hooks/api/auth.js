import { useContext } from 'react';
import { useMutation } from 'react-query';

import ROUTES from 'app/utils/routes';
import api from 'app/providers/apiProvider';

export const useAuthApi = () => {
  const baseURL = ROUTES.API.AUTH.INDEX;
  const auth = () => api.post('/');
  const login = (data) => api.post(`${baseURL}/login`, data);
  const register = (data) => api.post(`${baseURL}/register`, data);
  return { auth, login, register };
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
    const { register } = useAuthApi();
    return useMutation(register);
  } catch (e) {
    console.log(e);
  }
};
