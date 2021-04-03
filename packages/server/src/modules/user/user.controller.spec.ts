import { Test, TestingModule } from '@nestjs/testing';
import MockContestItemRepository from '../../../test/mocks/repositories/contest-item.repository';
import MockContestRepository from '../../../test/mocks/repositories/contest.repository';
import MockGameRepository from '../../../test/mocks/repositories/game.repository';
import MockUserRepository from '../../../test/mocks/repositories/user.repository';
import MockCloudinaryService from '../../../test/mocks/services/cloudinary.service';
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
            MockGameRepository,
            MockCloudinaryService,
            MockUserRepository,
          ),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TODO: Cover UserController with tests
});
