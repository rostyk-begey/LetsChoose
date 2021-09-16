import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { UserDto } from '@lets-choose/common/dto';
import { User, UserDocument } from './user.entity';
import { IUserRepository } from '@abstract/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId);
  }

  public async findByIdOrFail(userId: string): Promise<UserDocument> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async findByIdAndUpdate(
    userId: string,
    data: Partial<User>,
  ): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(userId, data);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  protected async findOne(query: Partial<User>): Promise<UserDocument | null> {
    return this.userModel.findOne(query);
  }

  public findByUsername(username: string): Promise<UserDocument | null> {
    return this.findOne({ username });
  }

  public findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email });
  }

  public async deleteUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndRemove(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async createUser(data: UserDto): Promise<UserDocument> {
    const user = new this.userModel({ ...data, _id: new Types.ObjectId() });
    await user.save();
    return user;
  }
}
