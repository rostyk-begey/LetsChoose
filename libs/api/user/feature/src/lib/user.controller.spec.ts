import { IUserService } from '@lets-choose/api/abstract';
import { UpdateUserProfileDto } from '@lets-choose/common/dto';
import { ContestRepository } from '@lets-choose/api/contest/data-access';
import { User, UserRepository } from '@lets-choose/api/user/data-access';
import { Test, TestingModule } from '@nestjs/testing';

import {
  contestItemRepositoryMock,
  contestRepositoryMock,
  gameRepositoryMock,
  userRepositoryMock,
  cloudinaryServiceMock,
} from '@lets-choose/api/testing/mocks';
import { userBuilder } from '@lets-choose/api/testing/builders';
import { ContestService } from '@modules/contest/contest.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import faker from 'faker';

describe('UserController', () => {
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
