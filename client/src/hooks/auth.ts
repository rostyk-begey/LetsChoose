import { useEffect, useState } from 'react';

import createTokenProvider, {
  AccessToken,
  Observer,
} from '../providers/tokenProvider';

const tokenProvider = createTokenProvider();

export type LoginFunction = (newToken: string) => void;
export type LogoutFunction = (redirectTo: string) => void;

const login: LoginFunction = (newToken) => tokenProvider.setToken(newToken);

const logout: LogoutFunction = (redirectTo) => {
  tokenProvider.setToken(null);
  if (redirectTo) {
    window.location.href = redirectTo;
  } else {
    window.location.reload();
  }
};

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    tokenProvider.isLoggedIn(),
  );

  const listener: Observer = (accessToken: AccessToken) => {
    setIsAuthenticated(Boolean(accessToken));
  };

  useEffect(() => {
    tokenProvider.subscribe(listener);
    return () => tokenProvider.unsubscribe(listener);
  }, []);

  return { isAuthenticated, logout, login };
};

export default useAuth;
