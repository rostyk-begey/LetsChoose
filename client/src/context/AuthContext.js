import { createContext } from 'react';
import { noop } from 'lodash';

const AuthContext = createContext({
  login: noop,
  logout: noop,
  isAuthenticated: false,
});

export default AuthContext;
