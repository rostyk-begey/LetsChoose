import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AuthContext from 'app/context/AuthContext';
import useRoutes from 'app/hooks/routes';
import useAuth from 'app/hooks/auth';

import './index.scss';

const App = () => {
  const { login, logout, token, userId } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  return (
    <AuthContext.Provider
      value={{ login, logout, token, userId, isAuthenticated }}
    >
      <BrowserRouter>{routes}</BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
