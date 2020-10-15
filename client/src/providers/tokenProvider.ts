import axios from 'axios';

import ROUTES from '../utils/routes';

export type AccessToken = string | null;
export type Observer = (accessToken: AccessToken) => void;

const STORAGE_KEY = 'AUTH';
let _accessToken: AccessToken = localStorage.getItem(STORAGE_KEY) || null;
let observers: Observer[] = [];

const isLoggedIn = () => !!_accessToken;

const notify = (accessToken: AccessToken) => {
  observers.forEach((observer) => observer(accessToken));
};

const setToken = (token: AccessToken) => {
  if (token) {
    localStorage.setItem(STORAGE_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  _accessToken = token;
  notify(_accessToken);
};

const getExpirationDate = (token: string): number | null => {
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));

  // multiply by 1000 to convert seconds into milliseconds
  return (payload && payload.exp && payload.exp * 1000) || null;
};

const isExpired = (exp: number | null) => (exp ? Date.now() > exp : false);

const getToken = async (): Promise<AccessToken> => {
  if (!_accessToken || isExpired(getExpirationDate(_accessToken))) {
    try {
      const {
        data: { accessToken = null },
      } = await axios.post(
        `${ROUTES.API.INDEX}${ROUTES.API.AUTH.REFRESH_TOKEN}`,
      );
      setToken(accessToken);
    } catch (e) {
      setToken(null);
    }
  }

  return _accessToken;
};

const subscribe = (observer: Observer) => observers.push(observer);

const unsubscribe = (observer: Observer) => {
  observers = observers.filter((_observer) => _observer !== observer);
};

const createTokenProvider = () => ({
  getToken,
  isLoggedIn,
  setToken,
  subscribe,
  unsubscribe,
});

export default createTokenProvider;
