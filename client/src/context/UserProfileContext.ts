import { createContext } from 'react';
import { User } from '../../../models/User';

const UserProfileContext = createContext<
  Pick<User, '_id' | 'username' | 'email' | 'avatar'>
>({
  _id: '',
  username: '',
  email: '',
  avatar: '',
});

export default UserProfileContext;
