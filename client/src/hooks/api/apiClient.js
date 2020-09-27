import { useRef } from 'react';
import axios from 'axios';

import ROUTES from 'app/utils/routes';

axios.interceptors.request.use((request) => {
  console.log('req interceptor');
  request.headers['Authorization'] = `Bearer ${localStorage.getItem()}`;
  return request;
});

const useApi = (token = null) => {
  const options = {
    baseURL: ROUTES.API.CONTESTS,
    headers: {
      Authorization: `Bearer ${token}`,
      accepts: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };
  return axios.create(options);
};

export default useApi;
