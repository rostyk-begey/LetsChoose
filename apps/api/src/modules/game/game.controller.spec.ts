import {
  ContestRepository,
  ContestItemRepository,
} from '@lets-choose/api/contest/data-access';
import { GameRepository } from '@lets-choose/api/game/data-access';
import { Test, TestingModule } from '@nestjs/testing';
import {
  contestItemRepositoryMock,
  contestRepositoryMock,
  gameRepositoryMock,
} from '@lets-choose/api/testing/mocks';
import { GameController } from '@modules/game/game.controller';
import { GameService } from '@modules/game/game.service';

// jest.mock('../contest/__mocks__/contest-item.repository');
// jest.mock('../contest/__mocks__/contest.repository');
// jest.mock('../game/__mocks__/game.repository');

describe('GameController', () => {
  let controller: GameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        GameService,
        {
          provide: ContestRepository,
          useValue: contestRepositoryMock,
        },
        {
          provide: ContestItemRepository,
          useValue: contestItemRepositoryMock,
        },
        {
          provide: GameRepository,
          useValue: gameRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TODO: Cover GameController with tests
});
