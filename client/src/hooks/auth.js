import { useEffect, useState } from 'react';

import createTokenProvider from 'app/providers/tokenProvider';

const tokenProvider = createTokenProvider();

const login = (newTokens) => tokenProvider.setToken(newTokens);

const logout = (redirectTo = null) => {
  tokenProvider.setToken(null);
  if (redirectTo) {
    window.location.href = redirectTo;
  } else {
    window.location.reload();
  }
};

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    tokenProvider.isLoggedIn(),
  );

  useEffect(() => {
    const listener = (isLogged) => setIsAuthenticated(isLogged);

    tokenProvider.subscribe(listener);
    return () => tokenProvider.unsubscribe(listener);
  }, []);

  return { isAuthenticated, logout, login };
};

export default useAuth;
