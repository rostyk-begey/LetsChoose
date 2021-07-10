import { IUserService } from '@abstract/user.service.interface';
import {
  HttpResponseMessageDto,
  UpdateUserProfileDto,
} from '@lets-choose/common';
import { User } from '@modules/user/user.entity';
import { Test, TestingModule } from '@nestjs/testing';

import contestItemRepository from '@modules/contest/__mocks__/contest-item.repository';
import contestRepository from '@modules/contest/__mocks__/contest.repository';
import gameRepository from '@modules/game/__mocks__/game.repository';
import userRepository, {
  userBuilder,
} from '@modules/user/__mocks__/user.repository';
import cloudinaryService from '@modules/cloudinary/__mocks__/cloudinary.service';
import { ContestService } from '@modules/contest/contest.service';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { TYPES } from '@src/injectable.types';
import faker from 'faker';

describe.skip('UserController', () => {
  let controller: UserController;
  let user: User;
  let mockRequest: any;
  let userService: IUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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

    controller = module.get<UserController>(UserController);
    userService = module.get<IUserService>(UserService);

    user = userBuilder();

    mockRequest = {
      user,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('me', () => {
    it('should return current user', async () => {
      const result = await controller.me(mockRequest);

      expect(result).toEqual(user);
    });
  });

  test('findByUsername', async () => {
    const findByUsernameSpy = jest
      .spyOn(userService, 'findByUsername')
      .mockResolvedValueOnce(user);

    const result = await controller.findByUsername(user.username);

    expect(result).toMatchObject(user);
    expect(findByUsernameSpy).toHaveBeenCalledWith(user.username);
  });

  test('updateUserProfile', async () => {
    const updateUserProfileSpy = jest
      .spyOn(userService, 'updateUserProfile')
      .mockResolvedValueOnce(user);
    const updateProfileDto: UpdateUserProfileDto = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
    };
    const result = await controller.updateUserProfile(
      mockRequest,
      updateProfileDto,
    );

    expect(result).toMatchObject(user);
    expect(updateUserProfileSpy).toHaveBeenCalledWith(
      user.id,
      updateProfileDto,
    );
  });

  test('removeMe', async () => {
    const removeUserByIdSpy = jest
      .spyOn(userService, 'removeUserById')
      .mockImplementationOnce(() => Promise.resolve());

    const { message } = await controller.removeMe(mockRequest);
    expect(message).toMatch(/deleted/);
    expect(removeUserByIdSpy).toHaveBeenCalledWith(user.id);
  });
});
