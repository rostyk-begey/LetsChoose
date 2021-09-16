import { CreateUserDto, UserDto } from '@lets-choose/common/dto';

export interface IUserRepository {
  findById(userId: string): Promise<UserDto | null>;
  findByIdOrFail(userId: string): Promise<UserDto>;
  findByIdAndUpdate(userId: string, data: Partial<UserDto>): Promise<UserDto>;
  findByUsername(username: string): Promise<UserDto | null>;
  findByEmail(email: string): Promise<UserDto | null>;
  deleteUser(userId: string): Promise<UserDto>;
  createUser(data: CreateUserDto): Promise<UserDto>;
}
