import { inject, injectable } from 'inversify';

import { User } from '../models/User';
import { AppError } from '../usecases/error';
import { ContestModel } from '../models/Contest';
import { ContestItemModel } from '../models/ContestItem';
import UserRepository, {
  IUserRepository,
} from '../repositories/UserRepository';

export interface IUserService {
  findById(userId: string): Promise<User>;
  findByUsername(username: string, currentUserId?: string): Promise<User>;
  removeUserByUsername(username: string): Promise<void>;
}

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(UserRepository)
    protected readonly userRepository: IUserRepository,
  ) {}

  public findById(userId: string): Promise<User> {
    return this.userRepository.findByIdOrFail(userId);
  }

  public findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }

  public async removeUserByUsername(username: string): Promise<void> {
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new AppError('User does not exists', 404);
    }

    const contests = await ContestModel.find({ author: user.id });
    const deletes = contests.map(async (contest) => {
      await ContestItemModel.deleteMany({ contestId: contest.id });
      await ContestModel.findByIdAndDelete(contest.id);
    });
    await Promise.all(deletes);
  }
}
