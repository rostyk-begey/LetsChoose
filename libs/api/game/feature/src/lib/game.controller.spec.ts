import {
  ContestItemRepository,
  ContestRepository,
} from '@lets-choose/api/contest/data-access';
import { GameRepository } from '@lets-choose/api/game/data-access';
import { Test, TestingModule } from '@nestjs/testing';
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { contestItemRepositoryMock } from '../../../../contest/data-access/src/lib/contest-item.repository.mock';
import { contestRepositoryMock } from '../../../../contest/data-access/src/lib/contest.repository.mock';
import { gameRepositoryMock } from '../../../data-access/src/lib/game.repository.mock';
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
