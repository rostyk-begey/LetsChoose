import { User } from '../modules/user/user.schema';
import { UserDto } from '@lets-choose/common';

export interface IUserRepository {
  findById(userId: string): Promise<User>;
  findByIdOrFail(userId: string): Promise<User>;
  findByIdAndUpdate(userId: string, data: Partial<User>): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  deleteUser(userId: string): Promise<User>;
  createUser(data: UserDto): Promise<User>;
}
