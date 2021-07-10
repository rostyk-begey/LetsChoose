import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Router from 'next/router';

import queryClient from '../utils/queryClient';
import ROUTES from '../utils/routes';

export default abstract class Api {
  protected readonly api: AxiosInstance;

  protected redirected = false;

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
      (response) => {
        this.redirected = false;
        return response;
      },
      (error) => {
        const originalRequest = error.config;

        if (
          error?.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== ROUTES.API.AUTH.REFRESH_TOKEN
        ) {
          originalRequest._retry = true;

          return this.api
            .post(ROUTES.API.AUTH.REFRESH_TOKEN)
            .then((res) => {
              if (res.status === 201) {
                // return originalRequest object with Axios.
                return this.api(originalRequest);
              }
            })
            .catch((err) => {
              if (err?.response?.status === 401 && !this.redirected) {
                this.redirected = true;
                queryClient.removeQueries(['user', 'me'], { exact: true });
                Router.push(ROUTES.LOGIN);
              }
            });
        }
        return Promise.reject(error);
      },
    );
  }
}
