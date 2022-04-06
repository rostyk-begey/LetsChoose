import { ROUTES } from '@lets-choose/client/utils';
import { UpdateUserProfileDto, UserPublicDto } from '@lets-choose/common/dto';

import { Api } from './api';

export class UsersApi extends Api {
  private readonly baseURL = ROUTES.API.USERS;

  session = () => {
    return this.find('me');
  };

  find = (idOrUsername: string) => {
    return this.api.get<UserPublicDto>(`${this.baseURL}/${idOrUsername}`);
  };

  updateProfile = (data: UpdateUserProfileDto) => {
    return this.api.post<UserPublicDto>(`${this.baseURL}/profile`, data);
  };

  deleteProfile = () => {
    return this.api.delete(`${this.baseURL}/me`);
  };
}
