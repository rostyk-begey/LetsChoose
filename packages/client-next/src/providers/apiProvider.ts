import axios, { AxiosRequestConfig } from 'axios';

import ROUTES from '../utils/routes';
import createTokenProvider from './tokenProvider';

const tokenProvider = createTokenProvider();

const options: AxiosRequestConfig = {
  baseURL: ROUTES.API.INDEX,
  headers: {
    accepts: 'application/json',
    'Content-Type': 'application/json',
  },
};

const api = axios.create(options);

// api.interceptors.request.use(async (request) => {
//   const accessToken = await tokenProvider.getToken();
//   console.log(accessToken);
//   if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`;
//   return request;
// });

export default api;
