import { inject, injectable } from 'inversify';

import { User } from '../models/User';
import { AppError } from '../usecases/error';
import { ContestModel } from '../models/Contest';
import { ContestItemModel } from '../models/ContestItem';
import UserRepository, {
  IUserRepository,
} from '../repositories/UserRepository';
import ContestRepository, {
  IContestRepository,
} from '../repositories/ContestRepository';
import ContestItemRepository, {
  IContestItemRepository,
} from '../repositories/ContestItemRepository';
import ContestService, { IContestService } from './ContestService';

export interface IUserService {
  findById(userId: string): Promise<User>;
  findByUsername(username: string, currentUserId?: string): Promise<User>;
  removeUserById(id: string): Promise<void>;
  removeUserByUsername(username: string): Promise<void>;
}

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(UserRepository)
    protected readonly userRepository: IUserRepository,

    @inject(ContestRepository)
    protected readonly contestRepository: IContestRepository,

    @inject(ContestService)
    protected readonly contestService: IContestService,
  ) {}

  public findById(userId: string): Promise<User> {
    return this.userRepository.findByIdOrFail(userId);
  }

  public findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }

  public async removeUserById(id: string): Promise<void> {
    const user = await this.userRepository.findByIdOrFail(id);
    await this.removeUserData(user.id);
  }

  public async removeUserByUsername(username: string): Promise<void> {
    const user = await this.userRepository.findOne({ username });
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
