import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AuthContext from '../../context/AuthContext';
import UserProfileContext from '../../context/UserProfileContext';
import useRoutes from '../../hooks/routes';
import useAuth from '../../hooks/auth';
import { useUserFind } from '../../hooks/api/user';
import { User } from '../../../../server/models/User';

import './index.scss';

const App: React.FC = () => {
  const { login, logout, isAuthenticated } = useAuth();
  const routes = useRoutes(isAuthenticated);
  // @ts-ignore
  const { data: { data: user } = {} } = useUserFind('me', {
    enabled: true,
  });

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      <UserProfileContext.Provider value={user as User}>
        <BrowserRouter>{routes}</BrowserRouter>
      </UserProfileContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
