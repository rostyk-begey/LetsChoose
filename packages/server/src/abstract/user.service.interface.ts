import { User } from '../modules/user/user.schema';

export interface IUserService {
  findById(userId: string): Promise<User>;
  findByUsername(username: string, currentUserId?: string): Promise<User>;
  removeUserById(id: string): Promise<void>;
  removeUserByUsername(username: string): Promise<void>;
}
