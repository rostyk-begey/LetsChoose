import { createContext } from 'react';

const UserProfileContext = createContext({
  user: {
    _id: '',
    username: '',
    email: '',
  },
});

export default UserProfileContext;
