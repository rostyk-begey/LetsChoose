import { UpdateUserProfileDto, UserDto } from '@lets-choose/common/dto';

export interface IUserService {
  findById(userId: string): Promise<UserDto>;
  findByUsername(username: string, currentUserId?: string): Promise<UserDto>;
  updateUserProfile(
    userId: string,
    data: UpdateUserProfileDto,
  ): Promise<UserDto>;
  removeUserById(id: string): Promise<void>;
  removeUserByUsername(username: string): Promise<void>;
}
