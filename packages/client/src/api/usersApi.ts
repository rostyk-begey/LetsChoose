import { UserDto } from '@lets-choose/common';

import ROUTES from '../utils/routes';
import Api from './api';

export default class UsersApi extends Api {
  private readonly baseURL = ROUTES.API.USERS;

  find(idOrUsername: string) {
    return this.api.get<UserDto>(`${this.baseURL}/${idOrUsername}`);
  }
}
