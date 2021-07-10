import { IContestService } from '@abstract/contest.service.interface';
import {
  Contest,
  UpdateUserPasswordDto,
  UpdateUserProfileDto,
} from '@lets-choose/common';
import { User } from '@modules/user/user.entity';
import { BadRequestException } from '@nestjs/common';
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
import * as faker from 'faker';

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
    userRepository.findByUsername.mockResolvedValueOnce(user);
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

  describe('updateUserProfile', () => {
    let data: UpdateUserProfileDto;
    let otherUser: User;

    beforeEach(() => {
      data = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
      };
      otherUser = userBuilder();

      userRepository.findByUsername.mockRestore();
      userRepository.findByEmail.mockRestore();
      userRepository.findByIdAndUpdate.mockRestore();
    });

    it("should update user's account correctly", async () => {
      userRepository.findByUsername.mockResolvedValueOnce(null);
      userRepository.findByEmail.mockResolvedValueOnce(null);
      userRepository.findByIdAndUpdate.mockResolvedValueOnce(otherUser);

      const result = await userService.updateUserProfile(user.id, data);

      expect(userRepository.findByUsername).toHaveBeenCalledWith(data.username);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(data.email);
      expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(
        user.id,
        data,
      );
      expect(result).toMatchObject(otherUser);
    });

    it('should throw error if username is in use', async () => {
      userRepository.findByUsername.mockResolvedValueOnce(otherUser);

      try {
        await userService.updateUserProfile(user.id, data);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(userRepository.findByUsername).toHaveBeenCalledWith(
          data.username,
        );
        expect(userRepository.findByEmail).not.toHaveBeenCalled();
        expect(userRepository.findByIdAndUpdate).not.toHaveBeenCalled();
      }

      expect.assertions(4);
    });

    it('should throw error if email is in use', async () => {
      userRepository.findByUsername.mockResolvedValueOnce(null);
      userRepository.findByEmail.mockResolvedValueOnce(otherUser);

      try {
        await userService.updateUserProfile(user.id, data);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(userRepository.findByUsername).toHaveBeenCalledWith(
          data.username,
        );
        expect(userRepository.findByEmail).toHaveBeenCalledWith(data.email);
        expect(userRepository.findByIdAndUpdate).not.toHaveBeenCalled();
      }

      expect.assertions(4);
    });
  });
});
