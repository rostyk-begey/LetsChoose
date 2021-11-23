import { CreateUserDto } from '@lets-choose/common/dto';
import { IRepository } from './repository.interface';

export interface UserDto {
  id: string;
  email: string;
  avatar: string;
  bio?: string;
  username: string;
  password: string;
  passwordVersion: number;
  confirmed: boolean;
}

export interface IUserRepository extends IRepository<UserDto, CreateUserDto> {
  findById(userId: string): Promise<UserDto>;
  findByIdAndUpdate(userId: string, data: Partial<UserDto>): Promise<UserDto>;
  findByUsername(username: string): Promise<UserDto | null>;
  findByEmail(email: string): Promise<UserDto | null>;
  findByIdAndRemove(userId: string): Promise<UserDto>;
  create(data: CreateUserDto): Promise<UserDto>;
}
