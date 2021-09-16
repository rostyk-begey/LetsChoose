import { CreateUserDto, UserDto } from '@lets-choose/common/dto';

export interface IUserRepository<T extends UserDto> {
  findById(userId: string): Promise<T | null>;
  findByIdOrFail(userId: string): Promise<T>;
  findByIdAndUpdate(userId: string, data: Partial<T>): Promise<T>;
  findByUsername(username: string): Promise<T | null>;
  findByEmail(email: string): Promise<T | null>;
  deleteUser(userId: string): Promise<T>;
  createUser(data: CreateUserDto): Promise<T>;
}
