import { createContext } from 'react';
import noop from 'lodash/noop';

import { LoginFunction, LogoutFunction } from '../hooks/auth';

interface IAuthContext {
  login: LoginFunction;
  logout: LogoutFunction;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext>({
  login: noop,
  logout: noop,
  isAuthenticated: false,
});

export default AuthContext;
