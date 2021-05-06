import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { config as axiosRequestConfig } from '../providers/apiProvider';

export default abstract class Api {
  protected readonly api: AxiosInstance;

  constructor(config: AxiosRequestConfig = {}) {
    this.api = axios.create({
      ...axiosRequestConfig,
      ...config,
    });
  }
}
