import axios, { AxiosRequestConfig } from 'axios';

import ROUTES from '../utils/routes';

export const config: AxiosRequestConfig = {
  baseURL: ROUTES.API.INDEX,
  headers: {
    accepts: 'application/json',
    'Content-Type': 'application/json',
  },
};

const api = axios.create(config);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (
      originalRequest.url === ROUTES.API.AUTH.REFRESH_TOKEN &&
      error?.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      return api.post(ROUTES.API.AUTH.REFRESH_TOKEN).then((res) => {
        if (res.status === 201) {
          // return originalRequest object with Axios.
          return api(originalRequest);
        }
      });
    }
    return Promise.reject(error);
  },
);

export default api;
