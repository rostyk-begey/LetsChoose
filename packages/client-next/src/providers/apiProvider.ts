import axios, { AxiosRequestConfig } from 'axios';

import ROUTES from '../utils/routes';

const options: AxiosRequestConfig = {
  baseURL: ROUTES.API.INDEX,
  headers: {
    accepts: 'application/json',
    'Content-Type': 'application/json',
  },
};

const api = axios.create(options);

export default api;
