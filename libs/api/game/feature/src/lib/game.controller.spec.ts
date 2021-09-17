import {
  ContestItemRepository,
  ContestRepository,
} from '@lets-choose/api/contest/data-access';
import { GameRepository } from '@lets-choose/api/game/data-access';
import {
  contestItemRepositoryMock,
  contestRepositoryMock,
  gameRepositoryMock,
} from '@lets-choose/api/testing/mocks';
import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';

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
