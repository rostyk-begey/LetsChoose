import { IUserRepository } from '../../../abstract/user.repository.interface';
import { User } from '../user.entity';

export const user: User = {
  avatar: 'avatar',
  bio: '',
  confirmed: true,
  passwordVersion: 1,
  _id: 'userId',
  id: 'userId',
  email: 'email',
  username: 'username',
  password: 'password',
};

const userRepository: jest.Mocked<IUserRepository> = {
  findById: jest.fn().mockResolvedValue(user),
  findByIdOrFail: jest.fn().mockResolvedValue(user),
  findByIdAndUpdate: jest.fn().mockResolvedValue(user),
  findByUsername: jest.fn().mockResolvedValue(user),
  findByEmail: jest.fn().mockResolvedValue(user),
  deleteUser: jest.fn().mockResolvedValue(user),
  createUser: jest.fn().mockResolvedValue(user),
};

export default userRepository;
