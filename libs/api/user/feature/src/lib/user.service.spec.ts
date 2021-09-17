import { IContestService, IUserService } from '@lets-choose/api/abstract';
import { cloudinaryServiceMock } from '@lets-choose/api/cloudinary';
import { ContestRepository } from '@lets-choose/api/contest/data-access';
import { ContestService } from '@lets-choose/api/contest/feature';
import { contestBuilder, userBuilder } from '@lets-choose/api/testing/builders';
import { User, UserRepository } from '@lets-choose/api/user/data-access';
import { ContestDto, UpdateUserProfileDto } from '@lets-choose/common/dto';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { contestItemRepositoryMock } from '../../../../contest/data-access/src/lib/contest-item.repository.mock';
import { contestRepositoryMock } from '../../../../contest/data-access/src/lib/contest.repository.mock';
import { gameRepositoryMock } from '../../../../game/data-access/src/lib/game.repository.mock';
import { userRepositoryMock } from '../../../data-access/src/lib/user.repository.mock';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: IUserService;
  let contestService: IContestService;
  let userId, username;
  let user: User;
  let contest: ContestDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
        {
          provide: ContestRepository,
          useValue: contestRepositoryMock,
        },
        {
          provide: ContestService,
          useValue: new ContestService(
            contestRepositoryMock,
            contestItemRepositoryMock,
            gameRepositoryMock,
            cloudinaryServiceMock,
            userRepositoryMock,
          ),
        },
      ],
    }).compile();

    userService = module.get<IUserService>(UserService);
    contestService = module.get<IContestService>(ContestService);
    user = userBuilder();
    contest = contestBuilder();
    ({ id: userId, username } = user);
  });

  test('findById', async () => {
    userRepositoryMock.findByUsername.mockResolvedValueOnce(user);
    await userService.findById(userId);
    expect(userRepositoryMock.findByIdOrFail).toHaveBeenCalledWith(userId);
  });

  test('findByUsername', async () => {
    userRepositoryMock.findByUsername.mockResolvedValueOnce(user);
    await userService.findByUsername(username);
    expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(username);
  });

  test('removeUserById', async () => {
    userRepositoryMock.findByIdOrFail.mockResolvedValueOnce(user);
    jest
      .spyOn(contestService, 'findContestsByAuthor')
      .mockResolvedValueOnce([contest]);
    jest.spyOn(contestService, 'removeContest').mockImplementation(() => null);

    await userService.removeUserById(userId);
    expect(userRepositoryMock.findByIdOrFail).toHaveBeenCalledWith(userId);
  });

  test('removeUserByUsername', async () => {
    userRepositoryMock.findByUsername.mockResolvedValueOnce(user);
    jest
      .spyOn(contestService, 'findContestsByAuthor')
      .mockResolvedValueOnce([contest]);
    jest.spyOn(contestService, 'removeContest').mockImplementation(() => null);

    await userService.removeUserByUsername(username);
    expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(username);
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

      userRepositoryMock.findByUsername.mockRestore();
      userRepositoryMock.findByEmail.mockRestore();
      userRepositoryMock.findByIdAndUpdate.mockRestore();
    });

    it("should update user's account correctly", async () => {
      userRepositoryMock.findByUsername.mockResolvedValueOnce(null);
      userRepositoryMock.findByEmail.mockResolvedValueOnce(null);
      userRepositoryMock.findByIdAndUpdate.mockResolvedValueOnce(otherUser);

      const result = await userService.updateUserProfile(user.id, data);

      expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(
        data.username,
      );
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(data.email);
      expect(userRepositoryMock.findByIdAndUpdate).toHaveBeenCalledWith(
        user.id,
        data,
      );
      expect(result).toMatchObject(otherUser);
    });

    it('should throw error if username is in use', async () => {
      userRepositoryMock.findByUsername.mockResolvedValueOnce(otherUser);

      try {
        await userService.updateUserProfile(user.id, data);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(
          data.username,
        );
        expect(userRepositoryMock.findByEmail).not.toHaveBeenCalled();
        expect(userRepositoryMock.findByIdAndUpdate).not.toHaveBeenCalled();
      }

      expect.assertions(4);
    });

    it('should throw error if email is in use', async () => {
      userRepositoryMock.findByUsername.mockResolvedValueOnce(null);
      userRepositoryMock.findByEmail.mockResolvedValueOnce(otherUser);

      try {
        await userService.updateUserProfile(user.id, data);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(
          data.username,
        );
        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(data.email);
        expect(userRepositoryMock.findByIdAndUpdate).not.toHaveBeenCalled();
      }

      expect.assertions(4);
    });
  });
});
