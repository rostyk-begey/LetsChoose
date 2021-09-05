import { ROUTES } from '@lets-choose/client/utils';
import { UpdateUserProfileDto, UserDto } from '@lets-choose/common/dto';

import { Api } from './api';

export class UsersApi extends Api {
  private readonly baseURL = ROUTES.API.USERS;

  find = (idOrUsername: string) => {
    return this.api.get<UserDto>(`${this.baseURL}/${idOrUsername}`);
  };

  updateProfile = (data: UpdateUserProfileDto) => {
    return this.api.post<UserDto>(`${this.baseURL}/profile`, data);
  };

  deleteProfile = () => {
    return this.api.delete(`${this.baseURL}/me`);
  };
}
