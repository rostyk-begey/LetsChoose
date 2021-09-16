import { UpdateUserProfileDto } from '@lets-choose/common/dto';
import { User } from '../../../../libs/api/user/data-access/src/lib/user.entity';

export interface IUserService {
  findById(userId: string): Promise<User>;
  findByUsername(username: string, currentUserId?: string): Promise<User>;
  updateUserProfile(userId: string, data: UpdateUserProfileDto): Promise<User>;
  removeUserById(id: string): Promise<void>;
  removeUserByUsername(username: string): Promise<void>;
}
