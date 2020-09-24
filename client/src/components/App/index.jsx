import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AuthContext from 'app/context/AuthContext';
import UserProfileContext from 'app/context/UserProfileContext';
import useRoutes from 'app/hooks/routes';
import useAuth from 'app/hooks/auth';
import { useUserFind } from 'app/hooks/api/user';

import './index.scss';

const App = () => {
  const { login, logout, isAuthenticated } = useAuth();
  const routes = useRoutes(isAuthenticated);
  const { data: { data: { _id: id, ...user } = {} } = {} } = useUserFind('me');

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      <UserProfileContext.Provider value={{ user: { id, ...user } }}>
        <BrowserRouter>{routes}</BrowserRouter>
      </UserProfileContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
