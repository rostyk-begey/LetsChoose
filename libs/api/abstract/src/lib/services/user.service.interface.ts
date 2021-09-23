import { UpdateUserProfileDto, UserPublicDto } from '@lets-choose/common/dto';

export interface IUserService {
  findById(userId: string): Promise<UserPublicDto>;
  findByUsername(
    username: string,
    currentUserId?: string,
  ): Promise<UserPublicDto>;
  updateUserProfile(
    userId: string,
    data: UpdateUserProfileDto,
  ): Promise<UserPublicDto>;
  removeUserById(id: string): Promise<void>;
  removeUserByUsername(username: string): Promise<void>;
}
