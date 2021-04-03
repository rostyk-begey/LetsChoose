import { Test, TestingModule } from '@nestjs/testing';
import MockContestItemRepository from '../../../test/mocks/repositories/contest-item.repository';
import MockContestRepository from '../../../test/mocks/repositories/contest.repository';
import MockGameRepository from '../../../test/mocks/repositories/game.repository';
import { TYPES } from '../../injectable.types';
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
          provide: TYPES.ContestRepository,
          useValue: MockContestRepository,
        },
        {
          provide: TYPES.ContestItemRepository,
          useValue: MockContestItemRepository,
        },
        {
          provide: TYPES.GameRepository,
          useValue: MockGameRepository,
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TODO: Cover GameController with tests
});
