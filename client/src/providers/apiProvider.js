import axios from 'axios';

import ROUTES from 'app/utils/routes';

import createTokenProvider from 'app/providers/tokenProvider';

const tokenProvider = createTokenProvider();

const options = {
  baseURL: ROUTES.API.INDEX,
  headers: {
    accepts: 'application/json',
    'Content-Type': 'application/json',
  },
};

const api = axios.create(options);

api.interceptors.request.use(async (request) => {
  const accessToken = await tokenProvider.getToken();
  if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`;
  return request;
});

export default api;
