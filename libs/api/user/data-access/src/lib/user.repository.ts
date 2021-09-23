import {
  AbstractMongooseRepository,
  IUserRepository,
  UserDto,
} from '@lets-choose/api/abstract';

import { CreateUserDto } from '@lets-choose/common/dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.entity';

@Injectable()
export class UserRepository
  extends AbstractMongooseRepository<UserDto, CreateUserDto>
  implements IUserRepository
{
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  protected async findOne(query: Partial<UserDto>): Promise<UserDto | null> {
    const user = await this.userModel.findOne(query).exec();
    return user ? this.toObject(user) : null;
  }

  public findByUsername(username: string): Promise<UserDto | null> {
    return this.findOne({ username });
  }

  public async findByEmail(email: string): Promise<UserDto | null> {
    return this.findOne({ email });
  }

  public async findByIdAndRemove(userId: string): Promise<UserDto> {
    const user = await this.userModel.findByIdAndRemove(userId).exec();
    return this.checkIfExistsAndTransformToDocument(user);
  }
}
