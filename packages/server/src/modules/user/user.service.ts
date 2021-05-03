import { Injectable, Inject } from '@nestjs/common';

import { IUserRepository } from '../../abstract/user.repository.interface';
import { User } from './user.entity';
import { TYPES } from '../../injectable.types';
import { IUserService } from '../../abstract/user.service.interface';
import { IContestService } from '../../abstract/contest.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(TYPES.UserRepository)
    protected readonly userRepository: IUserRepository,

    @Inject(TYPES.ContestService)
    protected readonly contestService: IContestService,
  ) {}

  public findById(userId: string): Promise<User> {
    return this.userRepository.findByIdOrFail(userId);
  }

  public findByUsername(username: string): Promise<User> {
    return this.userRepository.findByUsername(username);
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
