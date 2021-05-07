import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import ROUTES from '../utils/routes';

export default abstract class Api {
  protected readonly api: AxiosInstance;

  constructor(config: AxiosRequestConfig = {}) {
    const baseURL =
      typeof window !== 'undefined'
        ? ROUTES.API.INDEX
        : `http://localhost:5000${ROUTES.API.INDEX}`;

    this.api = axios.create({
      baseURL,
      headers: {
        accepts: 'application/json',
        'Content-Type': 'application/json',
      },
      ...config,
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const originalRequest = error.config;
        if (
          originalRequest.url === ROUTES.API.AUTH.REFRESH_TOKEN &&
          error?.response?.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          return this.api.post(ROUTES.API.AUTH.REFRESH_TOKEN).then((res) => {
            if (res.status === 201) {
              // return originalRequest object with Axios.
              return this.api(originalRequest);
            }
          });
        }
        return Promise.reject(error);
      },
    );
  }
}
