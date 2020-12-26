import { createContext } from 'react';

import { UserDto } from '@lets-choose/common';

const UserProfileContext = createContext<
  Pick<UserDto, '_id' | 'username' | 'email' | 'avatar'>
>({
  _id: '',
  username: '',
  email: '',
  avatar: '',
});

export default UserProfileContext;
