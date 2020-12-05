import { createContext } from 'react';

import { User } from '../../../server/models/User';

const UserProfileContext = createContext<
  Pick<User, '_id' | 'username' | 'email' | 'avatar'>
>({
  _id: '',
  username: '',
  email: '',
  avatar: '',
});

export default UserProfileContext;
