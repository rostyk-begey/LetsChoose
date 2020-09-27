import { createContext } from 'react';

const UserProfileContext = createContext({
  _id: '',
  username: '',
  email: '',
});

export default UserProfileContext;
