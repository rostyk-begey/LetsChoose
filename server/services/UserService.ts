import { inject, injectable } from 'inversify';

import { User } from '../models/User';
import { IUserRepository } from '../repositories/UserRepository';
import { IContestRepository } from '../repositories/ContestRepository';
import { IContestService } from './ContestService';
import { TYPES } from '../inversify.types';

export interface IUserService {
  findById(userId: string): Promise<User>;
  findByUsername(username: string, currentUserId?: string): Promise<User>;
  removeUserById(id: string): Promise<void>;
  removeUserByUsername(username: string): Promise<void>;
}

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    protected readonly userRepository: IUserRepository,

    @inject(TYPES.ContestRepository)
    protected readonly contestRepository: IContestRepository,

    @inject(TYPES.ContestService)
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
