import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'AUTH';

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: jwtToken, userId: id }),
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(STORAGE_KEY);
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
