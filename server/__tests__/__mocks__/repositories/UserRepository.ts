import { Types } from 'mongoose';

import { User } from '../../../models/User';
import { AppError } from '../../../usecases/error';
import {
  CreateUserData,
  IUserRepository,
} from '../../../repositories/UserRepository';
import users from './data/users';

export let mockUsers = [...users];

const UserRepository: IUserRepository = {
  async findById(userId: string): Promise<User> {
    return mockUsers.find(({ _id }) => userId === _id) as User;
  },

  async findByIdOrFail(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },

  async findByIdAndUpdate(userId: string, data: Partial<User>): Promise<User> {
    mockUsers = mockUsers.map(({ _id, ...user }) => {
      if (_id === userId) {
        return { _id, ...user, ...data };
      }
      return { _id, ...user };
    });
    return this.findByIdOrFail(userId);
  },

  async findByEmail(email: string): Promise<User> {
    return mockUsers.find(({ email: e }) => e === email) as User;
  },

  async findByUsername(username: string): Promise<User> {
    return mockUsers.find(({ username: u }) => u === username) as User;
  },

  async deleteUser(userId: string): Promise<User> {
    const user = await this.findByIdOrFail(userId);
    mockUsers = mockUsers.filter(({ _id }) => _id !== userId);
    return user;
  },

  async createUser(data: CreateUserData): Promise<User> {
    const userId = Types.ObjectId().toString();
    const user: User = {
      _id: userId,
      id: userId,
      confirmed: false,
      passwordVersion: 0,
      ...data,
    };
    mockUsers.push(user);
    return user;
  },
};

UserRepository.findById = jest.fn(UserRepository.findById);
UserRepository.findByIdOrFail = jest.fn(UserRepository.findByIdOrFail);
UserRepository.findByIdAndUpdate = jest.fn(UserRepository.findByIdAndUpdate);
UserRepository.findByEmail = jest.fn(UserRepository.findByEmail);
UserRepository.findByUsername = jest.fn(UserRepository.findByUsername);
UserRepository.deleteUser = jest.fn(UserRepository.deleteUser);
UserRepository.createUser = jest.fn(UserRepository.createUser);

export default UserRepository;
