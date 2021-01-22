import { Test, TestingModule } from '@nestjs/testing';

import MockContestRepository from '../../../test/mocks/repositories/ContestRepository';
import MockContestItemRepository from '../../../test/mocks/repositories/ContestItemRepository';
import MockCloudinaryService from '../../../test/mocks/services/CloudinaryService';
import MockUserRepository from '../../../test/mocks/repositories/UserRepository';
import { TYPES } from '../../injectable.types';
import { ContestService } from '../contest/contest.service';

import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  const userId = '5f0e3e8cda24411b78617891';
  const username = 'rostyk.begey';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: TYPES.UserRepository,
          useValue: MockUserRepository,
        },
        {
          provide: TYPES.ContestRepository,
          useValue: MockContestRepository,
        },
        {
          provide: TYPES.ContestService,
          useValue: new ContestService(
            MockContestRepository,
            MockContestItemRepository,
            MockCloudinaryService,
          ),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  test('findById', () => {
    userService.findById(userId);
    expect(MockUserRepository.findByIdOrFail).toHaveBeenCalledWith(userId);
  });

  test('findByUsername', () => {
    userService.findByUsername(username);
    expect(MockUserRepository.findByUsername).toHaveBeenCalledWith(username);
  });

  test('removeUserById', () => {
    userService.removeUserById(userId);
    expect(MockUserRepository.findByIdOrFail).toHaveBeenCalledWith(userId);
  });

  test('removeUserByUsername', () => {
    userService.removeUserByUsername(username);
    expect(MockUserRepository.findByUsername).toHaveBeenCalledWith(username);
  });

  // TODO: add more tests
});
