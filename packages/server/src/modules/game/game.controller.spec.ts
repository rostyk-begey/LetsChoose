import { Test, TestingModule } from '@nestjs/testing';
import contestItemRepository from '../contest/__mocks__/contest-item.repository';
import contestRepository from '../contest/__mocks__/contest.repository';
import gameRepository from '../game/__mocks__/game.repository';
import { TYPES } from '../../injectable.types';
import { GameController } from './game.controller';
import { GameService } from './game.service';

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
