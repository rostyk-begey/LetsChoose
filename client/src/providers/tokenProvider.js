import axios from 'axios';

import ROUTES from 'app/utils/routes';

const STORAGE_KEY = 'AUTH';
let _accessToken = localStorage.getItem(STORAGE_KEY) || null;
let observers = [];

const isLoggedIn = () => !!_accessToken;

const notify = (accessToken) => {
  observers.forEach((observer) => observer(accessToken));
};

const setToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  _accessToken = token;
  notify(_accessToken);
};

const getExpirationDate = (token) => {
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));

  // multiply by 1000 to convert seconds into milliseconds
  return (payload && payload.exp && payload.exp * 1000) || null;
};

const isExpired = (exp) => (exp ? Date.now() > exp : false);

const getToken = async () => {
  if (!_accessToken) return null;

  if (isExpired(getExpirationDate(_accessToken))) {
    try {
      const {
        data: { accessToken = null },
      } = await axios.post(
        `${ROUTES.API.INDEX}${ROUTES.API.AUTH.INDEX}${ROUTES.API.AUTH.REFRESH_TOKEN}`,
      );
      setToken(accessToken);
    } catch (e) {
      setToken(null);
    }
  }

  return _accessToken;
};

const subscribe = (observer) => {
  observers.push(observer);
};

const unsubscribe = (observer) => {
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
