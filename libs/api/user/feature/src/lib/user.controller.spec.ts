import { IUserService } from '@lets-choose/api/abstract';
import { ContestRepository } from '@lets-choose/api/contest/data-access';
import { ContestService } from '@lets-choose/api/contest/feature';
import { userBuilder } from '@lets-choose/api/testing/builders';
import { User, UserRepository } from '@lets-choose/api/user/data-access';
import { UpdateUserProfileDto } from '@lets-choose/common/dto';
import { Test, TestingModule } from '@nestjs/testing';
import faker from 'faker';
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { cloudinaryServiceMock } from '../../../../cloudinary/src/lib/cloudinary.service.mock';
import { contestItemRepositoryMock } from '../../../../contest/data-access/src/lib/contest-item.repository.mock';
import { contestRepositoryMock } from '../../../../contest/data-access/src/lib/contest.repository.mock';
import { gameRepositoryMock } from '../../../../game/data-access/src/lib/game.repository.mock';
import { userRepositoryMock } from '../../../data-access/src/lib/user.repository.mock';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let user: User;
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('me', () => {
    it('should return current user', async () => {
      const result = await controller.me(user);

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
    const result = await controller.updateUserProfile(user, updateProfileDto);

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

    const { message } = await controller.removeMe(user);
    expect(message).toMatch(/deleted/);
    expect(removeUserByIdSpy).toHaveBeenCalledWith(user.id);
  });
});
