import { Test, TestingModule } from '@nestjs/testing';

import contestItemRepository from '../contest/__mocks__/contest-item.repository';
import contestRepository from '../contest/__mocks__/contest.repository';
import gameRepository from '../game/__mocks__/game.repository';
import userRepository from '../user/__mocks__/user.repository';
import cloudinaryService from '../cloudinary/__mocks__/cloudinary.service';
import { TYPES } from '../../injectable.types';
import { ContestService } from '../contest/contest.service';

import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TODO: Cover UserController with tests
});
