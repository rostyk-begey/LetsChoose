import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { queryClient, ROUTES } from '@lets-choose/client/utils';

export abstract class Api {
  protected readonly api: AxiosInstance;

  protected redirected = false;

  constructor(config: AxiosRequestConfig = {}) {
    const appURL =
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      '';

    const baseURL = `${appURL}${ROUTES.API.INDEX}`;

    this.api = axios.create({
      baseURL,
      headers: {
        accepts: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
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
          error?.response?.status !== 401 ||
          originalRequest._retry ||
          originalRequest.url === ROUTES.API.AUTH.REFRESH_TOKEN ||
          originalRequest.url === ROUTES.API.AUTH.LOGOUT
        ) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        return this.api
          .post(ROUTES.API.AUTH.REFRESH_TOKEN)
          .then((response) =>
            this.onRefreshTokenSuccess(response, originalRequest),
          )
          .catch(this.onRefreshTokenFailure);
      },
    );
  }

  private onRefreshTokenSuccess(
    response: AxiosResponse,
    originalRequest: AxiosRequestConfig,
  ) {
    if (response.status === 201) {
      // return originalRequest object with Axios.
      return this.api(originalRequest);
    }

    return response;
  }

  private onRefreshTokenFailure(err: AxiosError) {
    if (err?.response?.status === 401 && !this.redirected) {
      this.redirected = true;

      queryClient.invalidateQueries([{ scope: 'users', entity: 'session' }], {
        exact: true,
      });
    }
  }
}
