import { IContestService } from '@abstract/contest.service.interface';
import { Contest } from '@lets-choose/common';
import { User } from '@modules/user/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { IUserService } from '@abstract/user.service.interface';
import { TYPES } from '@src/injectable.types';
import contestRepository, {
  contestBuilder,
} from '@modules/contest/__mocks__/contest.repository';
import contestItemRepository from '@modules/contest/__mocks__/contest-item.repository';
import cloudinaryService from '@modules/cloudinary/__mocks__/cloudinary.service';
import gameRepository from '@modules/game/__mocks__/game.repository';
import { ContestService } from '@modules/contest/contest.service';
import { UserService } from '@modules/user/user.service';
import userRepository, {
  userBuilder,
} from '@modules/user/__mocks__/user.repository';

describe('UserService', () => {
  let userService: IUserService;
  let contestService: IContestService;
  let userId, username;
  let user: User;
  let contest: Contest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: TYPES.UserRepository,
          useValue: userRepository,
        },
        {
          provide: TYPES.ContestRepository,
          useValue: contestRepository,
        },
        {
          provide: TYPES.ContestService,
          useValue: new ContestService(
            contestRepository,
            contestItemRepository,
            gameRepository,
            cloudinaryService,
            userRepository,
          ),
        },
      ],
    }).compile();

    userService = module.get<IUserService>(TYPES.UserService);
    contestService = module.get<IContestService>(TYPES.ContestService);
    user = userBuilder();
    contest = contestBuilder();
    ({ id: userId, username } = user);
  });

  test('findById', async () => {
    userRepository.findById.mockResolvedValueOnce(user);
    await userService.findById(userId);
    expect(userRepository.findByIdOrFail).toHaveBeenCalledWith(userId);
  });

  test('findByUsername', async () => {
    userRepository.findByUsername.mockResolvedValueOnce(user);
    await userService.findByUsername(username);
    expect(userRepository.findByUsername).toHaveBeenCalledWith(username);
  });

  test('removeUserById', async () => {
    userRepository.findByIdOrFail.mockResolvedValueOnce(user);
    jest
      .spyOn(contestService, 'findContestsByAuthor')
      .mockResolvedValueOnce([contest]);
    jest.spyOn(contestService, 'removeContest').mockImplementation(() => null);

    await userService.removeUserById(userId);
    expect(userRepository.findByIdOrFail).toHaveBeenCalledWith(userId);
  });

  test('removeUserByUsername', async () => {
    userRepository.findByUsername.mockResolvedValueOnce(user);
    jest
      .spyOn(contestService, 'findContestsByAuthor')
      .mockResolvedValueOnce([contest]);
    jest.spyOn(contestService, 'removeContest').mockImplementation(() => null);

    await userService.removeUserByUsername(username);
    expect(userRepository.findByUsername).toHaveBeenCalledWith(username);
  });

  // TODO: add more tests
});
