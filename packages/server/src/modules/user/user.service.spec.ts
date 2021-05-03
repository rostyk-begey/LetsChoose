import { Test, TestingModule } from '@nestjs/testing';

import { IUserService } from '../../abstract/user.service.interface';
import contestRepository from '../contest/__mocks__/contest.repository';
import contestItemRepository from '../contest/__mocks__/contest-item.repository';
import cloudinaryService from '../cloudinary/__mocks__/cloudinary.service';
import userRepository from './__mocks__/user.repository';
import gameRepository from '../game/__mocks__/game.repository';
import { TYPES } from '../../injectable.types';
import { ContestService } from '../contest/contest.service';
import { UserService } from './user.service';

jest.mock('./__mocks__/user.repository');

describe('UserService', () => {
  let userService: IUserService;
  const userId = '5f0e3e8cda24411b78617891';
  const username = 'rostyk.begey';

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('findById', () => {
    userService.findById(userId);
    expect(userRepository.findByIdOrFail).toHaveBeenCalledWith(userId);
  });

  test('findByUsername', () => {
    userService.findByUsername(username);
    expect(userRepository.findByUsername).toHaveBeenCalledWith(username);
  });

  test('removeUserById', () => {
    userService.removeUserById(userId);
    expect(userRepository.findByIdOrFail).toHaveBeenCalledWith(userId);
  });

  test('removeUserByUsername', () => {
    userService.removeUserByUsername(username);
    expect(userRepository.findByUsername).toHaveBeenCalledWith(username);
  });

  // TODO: add more tests
});
