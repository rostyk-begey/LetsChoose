import { Test, TestingModule } from '@nestjs/testing';
import MockContestRepository, {
  mockContests,
} from '../../../test/mocks/repositories/contest.repository';
import MockContestItemRepository from '../../../test/mocks/repositories/contest-item.repository';
import MockGameRepository, {
  mockGames,
} from '../../../test/mocks/repositories/game.repository';
import { TYPES } from '../../injectable.types';
import { GameService } from './game.service';

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    gameService = module.get<GameService>(GameService);
  });

  test('findById', async () => {
    const game = await gameService.findGameById(mockGames[0].id);
    expect(game).toMatchObject(mockGames[0]);
  });

  test('start', async () => {
    const contestId = mockContests[0].id;
    const game = await gameService.start(contestId);

    expect(game.contestId).toEqual(contestId);
    // test('test new games contestId', () => {
    // });

    expect(game.round).toEqual(0);
    // test('test new games round', () => {
    // });

    expect(game.finished).toEqual(false);
    // test('test new games finished', () => {
    // });

    expect(game.items.length).toBeGreaterThanOrEqual(2);
    // test('test new games finished', () => {
    // });

    expect(game.totalRounds).toEqual(
      game.items.length > 2 ? Math.sqrt(game.items.length) : 1,
    );
    // test('test total totalRounds', () => {
    // });
  });
});
