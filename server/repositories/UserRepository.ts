import { injectable } from 'inversify';

import { User, UserModel } from '../models/User';
import { AppError } from '../usecases/error';

export type CreateUserData = Omit<
  User,
  '_id' | 'id' | 'passwordVersion' | 'confirmed'
>;

export interface IUserRepository {
  findById(userId: string): Promise<User>;
  findByIdOrFail(userId: string): Promise<User>;
  findByIdAndUpdate(userId: string, data: Partial<User>): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  deleteUser(userId: string): Promise<User>;
  createUser(data: CreateUserData): Promise<User>;
}

@injectable()
export default class UserRepository implements IUserRepository {
  public async findById(userId: string): Promise<User> {
    return (UserModel.findById(userId) as unknown) as User;
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

  protected async findOne(query: Partial<User>): Promise<User> {
    const user = await UserModel.findOne(query);
    return user as User;
  }

  public findByUsername(username: string): Promise<User> {
    return this.findOne({ username });
  }

  public findByEmail(email: string): Promise<User> {
    return this.findOne({ email });
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
