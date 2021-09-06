import { UpdateUserProfileDto } from '@lets-choose/common/dto';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { IUserRepository } from '@abstract/user.repository.interface';
import { IUserService } from '@abstract/user.service.interface';
import { IContestService } from '@abstract/contest.service.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { ContestService } from '@modules/contest/contest.service';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepository)
    protected readonly userRepository: IUserRepository,

    @Inject(ContestService)
    protected readonly contestService: IContestService,
  ) {}

  public findById(userId: string): Promise<User> {
    return this.userRepository.findByIdOrFail(userId);
  }

  public findByUsername(username: string): Promise<User> {
    return this.userRepository.findByUsername(username);
  }

  public async updateUserProfile(
    userId: string,
    { username, email }: UpdateUserProfileDto,
  ): Promise<User> {
    const userByUsername = await this.userRepository.findByUsername(username);
    if (userByUsername && userByUsername.id.toString() !== userId.toString()) {
      throw new BadRequestException('Username already taken');
    }

    const userByEmail = await this.userRepository.findByEmail(email);
    if (userByEmail && userByEmail.id.toString() !== userId.toString()) {
      throw new BadRequestException(`User with email ${email} already exists`);
    }

    return this.userRepository.findByIdAndUpdate(userId, { username, email });
  }

  public async removeUserById(id: string): Promise<void> {
    const user = await this.userRepository.findByIdOrFail(id);
    await this.removeUserData(user.id);
  }

  public async removeUserByUsername(username: string): Promise<void> {
    const user = await this.userRepository.findByUsername(username);
    await this.removeUserData(user.id);
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
