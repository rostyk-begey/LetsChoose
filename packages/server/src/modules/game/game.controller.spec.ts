import { Test, TestingModule } from '@nestjs/testing';
import contestItemRepository from '@modules/contest/__mocks__/contest-item.repository';
import contestRepository from '@modules/contest/__mocks__/contest.repository';
import gameRepository from '@modules/game/__mocks__/game.repository';
import { GameController } from '@modules/game/game.controller';
import { GameService } from '@modules/game/game.service';
import { TYPES } from '@src/injectable.types';

jest.mock('../contest/__mocks__/contest-item.repository');
jest.mock('../contest/__mocks__/contest.repository');
jest.mock('../game/__mocks__/game.repository');

describe('GameController', () => {
  let controller: GameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        GameService,
        {
          provide: TYPES.ContestRepository,
          useValue: contestRepository,
        },
        {
          provide: TYPES.ContestItemRepository,
          useValue: contestItemRepository,
        },
        {
          provide: TYPES.GameRepository,
          useValue: gameRepository,
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
