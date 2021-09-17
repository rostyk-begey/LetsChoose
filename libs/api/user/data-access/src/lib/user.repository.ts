import { IUserRepository } from '@lets-choose/api/abstract';

import { CreateUserDto } from '@lets-choose/common/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async findById(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    return user ? new User(user.toObject()) : null;
  }

  public async findByIdOrFail(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async findByIdAndUpdate(
    userId: string,
    data: Partial<User>,
  ): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(userId, data);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new User(user.toObject());
  }

  protected async findOne(query: Partial<User>): Promise<User | null> {
    return this.userModel.findOne(query);
  }

  public findByUsername(username: string): Promise<User | null> {
    return this.findOne({ username });
  }

  public findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  public async deleteUser(userId: string): Promise<User> {
    const user = await this.userModel.findByIdAndRemove(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async createUser(data: CreateUserDto): Promise<User> {
    const user = new this.userModel({ ...data, _id: new Types.ObjectId() });
    await user.save();
    return user;
  }
}
