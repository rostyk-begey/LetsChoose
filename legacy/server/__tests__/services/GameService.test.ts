import container from '../container';
import { TYPES } from '../../inversify.types';
import { IGameService } from '../../services/GameService';
import { mockGames } from '../__mocks__/repositories/GameRepository';
import { mockContests } from '../__mocks__/repositories/ContestRepository';
import { Game } from '../../models/Game';

const gameService: IGameService = container.get<IGameService>(
  TYPES.GameService,
);

test('Test GameService findById', async () => {
  const game = await gameService.findGameById(mockGames[0].id);
  expect(game).toMatchObject(mockGames[0]);
});

describe('Test GameService start', () => {
  const contestId = mockContests[0].id;
  let game: Game;

  beforeAll(async () => {
    game = await gameService.start(contestId);
  });

  test('test new game contestId', () => {
    expect(game.contestId).toEqual(contestId);
  });

  test('test new game round', () => {
    expect(game.round).toEqual(0);
  });

  test('test new game finished', () => {
    expect(game.finished).toEqual(false);
  });

  test('test new game finished', () => {
    expect(game.items?.length).toBeGreaterThanOrEqual(2);
  });

  test('test total totalRounds', () => {
    expect(game.totalRounds).toEqual(
      game.items!.length > 2 ? Math.sqrt(game.items!.length) : 1,
    );
  });
});
