import { UpdateUserProfileDto, UserDto } from '@lets-choose/common/dto';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import {
  IUserRepository,
  IUserService,
  IContestService,
} from '@lets-choose/api/abstract';
import { UserRepository } from '@lets-choose/api/user/data-access';
import { ContestService } from '@modules/contest/contest.service';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepository)
    protected readonly userRepository: IUserRepository,

    @Inject(ContestService)
    protected readonly contestService: IContestService,
  ) {}

  public findById(userId: string): Promise<UserDto> {
    return this.userRepository.findByIdOrFail(userId);
  }

  public findByUsername(username: string): Promise<UserDto> {
    return this.userRepository.findByUsername(username);
  }

  public async updateUserProfile(
    userId: string,
    { username, email }: UpdateUserProfileDto,
  ): Promise<UserDto> {
    const userByUsername = await this.userRepository.findByUsername(username);
    if (userByUsername && userByUsername._id.toString() !== userId.toString()) {
      throw new BadRequestException('Username already taken');
    }

    const userByEmail = await this.userRepository.findByEmail(email);
    if (userByEmail && userByEmail._id.toString() !== userId.toString()) {
      throw new BadRequestException(`User with email ${email} already exists`);
    }

    return this.userRepository.findByIdAndUpdate(userId, { username, email });
  }

  public async removeUserById(id: string): Promise<void> {
    const user = await this.userRepository.findByIdOrFail(id);
    await this.removeUserData(user._id);
  }

  public async removeUserByUsername(username: string): Promise<void> {
    const user = await this.userRepository.findByUsername(username);
    await this.removeUserData(user._id);
  }

  protected async removeUserData(userId: string): Promise<void> {
    const contests = await this.contestService.findContestsByAuthor(userId);
    await Promise.all(
      contests.map(async ({ _id }) => {
        await this.contestService.removeContest(_id);
      }),
    );
  }
}
