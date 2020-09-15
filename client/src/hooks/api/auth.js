import { useContext } from 'react';
import { useMutation, useQuery } from 'react-query';

import AuthContext from 'app/context/AuthContext';
import axios from 'axios';
import ROUTES from 'app/utils/routes';

export const useAuthApi = () => {
  const { token } = useContext(AuthContext);
  const api = axios.create({
    baseURL: ROUTES.API.AUTH.INDEX,
    headers: {
      accepts: 'application/json',
    },
  });
  const auth = () =>
    api.post(
      '/',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  const login = (data) => api.post(`/login`, data);
  const register = (data) => api.post('/register', data);
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
