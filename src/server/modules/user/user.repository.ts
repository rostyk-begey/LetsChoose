import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User } from './user.schema';
import { UserDocument } from './user.schema';
import { UserDto } from '../../../common/dto/user.dto';
import { IUserRepository } from '../../abstract/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async findById(userId: string): Promise<User> {
    return this.userModel.findById(userId);
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
    return user;
  }

  protected async findOne(query: Partial<User>): Promise<User> {
    return this.userModel.findOne(query);
  }

  public findByUsername(username: string): Promise<User> {
    return this.findOne({ username });
  }

  public findByEmail(email: string): Promise<User> {
    return this.findOne({ email });
  }

  public async deleteUser(userId: string): Promise<User> {
    const user = await this.userModel.findByIdAndRemove(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async createUser(data: UserDto): Promise<User> {
    const user = new this.userModel({ _id: Types.ObjectId(), ...data });
    await user.save();
    return user;
  }
}
