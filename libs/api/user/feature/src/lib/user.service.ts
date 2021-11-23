import {
  IContestService,
  IUserRepository,
  IUserService,
} from '@lets-choose/api/abstract';
import { ContestService } from '@lets-choose/api/contest/feature';
import { User, UserRepository } from '@lets-choose/api/user/data-access';
import { UpdateUserProfileDto, UserPublicDto } from '@lets-choose/common/dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepository)
    protected readonly userRepository: IUserRepository,

    @Inject(ContestService)
    protected readonly contestService: IContestService,
  ) {}

  public findById(userId: string): Promise<UserPublicDto> {
    return this.userRepository.findById(userId);
  }

  public findByUsername(username: string): Promise<UserPublicDto> {
    return this.userRepository.findByUsername(username);
  }

  public async updateUserProfile(
    userId: string,
    { username, email }: UpdateUserProfileDto,
  ): Promise<UserPublicDto> {
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
    const user = await this.userRepository.findById(id);
    await this.removeUserData(user.id);
  }

  public async removeUserByUsername(username: string): Promise<void> {
    const user = await this.userRepository.findByUsername(username);
    await this.removeUserData(user.id);
  }

  protected async removeUserData(userId: string): Promise<void> {
    const contests = await this.contestService.findContestsByAuthor(userId);
    await Promise.all(
      contests.map(async ({ id }) => {
        await this.contestService.removeContest(id);
      }),
    );
  }
}
