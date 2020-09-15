import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'AUTH';

const useAuth = () => {
  const authData = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const [token, setToken] = useState(authData?.token);
  const [userId, setUserId] = useState(authData?.userId);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: jwtToken, userId: id }),
    );
  }, []);

  const logout = useCallback((redirectTo = null) => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(STORAGE_KEY);
    if (redirectTo) {
      // history.push(redirectTo);
    }
  }, []);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (authData && authData.token && authData.userId) {
      login(authData.token, authData.userId);
    }
  }, [login]);

  return { login, logout, token, userId };
};

export default useAuth;
