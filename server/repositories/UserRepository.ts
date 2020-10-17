import { DocumentQuery } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { User, UserModel } from '../models/User';
import { AppError } from '../usecases/error';

export type CreateUserData = Omit<
  User,
  '_id' | 'id' | 'passwordVersion' | 'confirmed'
>;

export interface IUserRepository {
  findById(
    userId: string,
  ): Promise<DocumentQuery<DocumentType<User> | null, DocumentType<User>>>;
  findByIdOrFail(userId: string): Promise<User>;
  findByIdAndUpdate(userId: string, data: Partial<User>): Promise<User>;
  findOne(query: Partial<User>): Promise<User>;
  deleteUser(userId: string): Promise<User>;
  createUser(data: CreateUserData): Promise<User>;
}

export default class UserRepository implements IUserRepository {
  public async findById(
    userId: string,
  ): Promise<DocumentQuery<DocumentType<User> | null, DocumentType<User>>> {
    return UserModel.findById(userId);
  }
  public async findByIdOrFail(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  public async findByIdAndUpdate(
    userId: string,
    data: Partial<User>,
  ): Promise<User> {
    const user = await UserModel.findByIdAndUpdate(userId, data);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  public async findOne(query: Partial<User>): Promise<User> {
    const user = await UserModel.findOne(query);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  public async deleteUser(userId: string): Promise<User> {
    const user = await UserModel.findByIdAndRemove(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  public async createUser(data: CreateUserData): Promise<User> {
    const user = new UserModel(data);
    await user.save();
    return user;
  }
}
