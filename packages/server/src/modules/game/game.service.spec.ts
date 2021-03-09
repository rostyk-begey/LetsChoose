import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import MockContestRepository, {
  mockContests,
} from '../../../test/mocks/repositories/contest.repository';
import MockContestItemRepository from '../../../test/mocks/repositories/contest-item.repository';
import MockGameRepository, {
  mockGames,
} from '../../../test/mocks/repositories/game.repository';
import { TYPES } from '../../injectable.types';
import { ContestItem } from '../contest/contest-item.schema';
import { GameItem } from './game-item.schema';
import { Game } from './game.schema';
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

  test('calculateTotalRounds', async () => {
    expect(GameService['calculateTotalRounds'](16)).toEqual(4);
    expect(GameService['calculateTotalRounds'](8)).toEqual(3);
    expect(GameService['calculateTotalRounds'](4)).toEqual(2);
    expect(GameService['calculateTotalRounds'](2)).toEqual(1);
  });

  test('calculateGameItemsLength', async () => {
    expect(GameService['calculateGameItemsLength'](17)).toEqual(16);
    expect(GameService['calculateGameItemsLength'](16)).toEqual(16);

    expect(GameService['calculateGameItemsLength'](15)).toEqual(8);
    expect(GameService['calculateGameItemsLength'](9)).toEqual(8);
    expect(GameService['calculateGameItemsLength'](8)).toEqual(8);

    expect(GameService['calculateGameItemsLength'](5)).toEqual(4);
    expect(GameService['calculateGameItemsLength'](4)).toEqual(4);

    expect(GameService['calculateGameItemsLength'](2)).toEqual(2);
  });

  describe('getRoundItems', () => {
    test('getRoundItems [round: (1 / 2) | pair: (1 / 2)]', () => {
      const gameItems: GameItem[] = [
        { contestItem: '1', wins: 0, compares: 0 },
        { contestItem: '2', wins: 0, compares: 0 },
        { contestItem: '3', wins: 0, compares: 0 },
        { contestItem: '4', wins: 0, compares: 0 },
      ];
      const round = 0;
      expect(
        gameService['getRoundItems'](gameItems as GameItem[], round).length,
      ).toEqual(4);
    });

    test('getRoundItems [round: (1 / 2) | pair: (2 / 2)]', () => {
      const gameItems: GameItem[] = [
        { contestItem: '1', wins: 1, compares: 1 },
        { contestItem: '2', wins: 0, compares: 1 },
        { contestItem: '3', wins: 0, compares: 0 },
        { contestItem: '4', wins: 0, compares: 0 },
      ];
      const round = 0;
      expect(
        gameService['getRoundItems'](gameItems as GameItem[], round).length,
      ).toEqual(2);
    });

    test('getRoundItems [round: (2 / 2) | pair: (1 / 1)]', () => {
      const gameItems: GameItem[] = [
        { contestItem: '1', wins: 1, compares: 1 },
        { contestItem: '2', wins: 1, compares: 1 },
        { contestItem: '3', wins: 0, compares: 1 },
        { contestItem: '4', wins: 0, compares: 1 },
      ];
      const round = 1;
      expect(
        gameService['getRoundItems'](gameItems as GameItem[], round).length,
      ).toEqual(2);
    });

    test('getRoundItems [round: (3 / 2) | pair: (1 / 1)]', () => {
      const gameItems: GameItem[] = [
        { contestItem: '1', wins: 2, compares: 2 },
        { contestItem: '2', wins: 1, compares: 2 },
        { contestItem: '3', wins: 0, compares: 1 },
        { contestItem: '4', wins: 0, compares: 1 },
      ];
      const round = 2;
      expect(
        gameService['getRoundItems'](gameItems as GameItem[], round).length,
      ).toEqual(1);
    });
  });

  describe('playRoundUpdateGame', () => {
    const pair: ContestItem[] = [
      {
        _id: 'item1',
        id: 'item1',
        title: 'item1',
        image: 'item1',
        contestId: 'contest1',
        finalWins: 2,
        wins: 4,
        games: 2,
        compares: 4,
      },
      {
        _id: 'item2',
        id: 'item2',
        title: 'item2',
        image: 'item2',
        contestId: 'contest1',
        finalWins: 2,
        wins: 4,
        games: 2,
        compares: 4,
      },
    ];
    const getBaseGameItems = (): GameItem[] => [
      { contestItem: 'item1', wins: 0, compares: 0 },
      { contestItem: 'item2', wins: 0, compares: 0 },
      { contestItem: 'item3', wins: 0, compares: 0 },
      { contestItem: 'item4', wins: 0, compares: 0 },
    ];
    const gameBase: Partial<Game> = {
      _id: 'game1',
      id: 'game1',
      contestId: 'contest1',
      winnerId: undefined,
      totalRounds: 2,
      pair,
    };
    const findItemById = (id) => ({ contestItem }) => contestItem === id;
    const winnerId = 'item1';
    const looserId = 'item2';

    test('playRoundUpdateGame [round: (1 / 2) | pair: (1 / 2)]', () => {
      const finished = false;
      const round = 0;
      const pairNumber = 1;
      const pairsInRound = 2;
      const game = {
        ...gameBase,
        items: getBaseGameItems(),
        round,
        pairNumber,
        pairsInRound,
        finished,
      } as Game;
      const updatedGame = gameService['playRoundUpdateGame'](game, winnerId);
      const winner = updatedGame.items.find(findItemById(winnerId));
      const looser = updatedGame.items.find(findItemById(looserId));
      const item3 = updatedGame.items.find(findItemById('item3'));
      const item4 = updatedGame.items.find(findItemById('item4'));

      expect(updatedGame.round).toEqual(round);
      expect(updatedGame.pairNumber).toEqual(pairNumber + 1);
      expect(updatedGame.finished).toEqual(finished);
      expect(updatedGame.pairsInRound).toEqual(pairsInRound);

      expect(winner.wins).toEqual(1);
      expect(winner.compares).toEqual(1);

      expect(looser.wins).toEqual(0);
      expect(looser.compares).toEqual(1);

      expect(item3).toMatchObject(getBaseGameItems()[2]);
      expect(item4).toMatchObject(getBaseGameItems()[3]);
    });

    test('playRoundUpdateGame [round: (1 / 2) | pair: (2 / 2)]', () => {
      const gameItems = [
        { contestItem: 'item1', wins: 0, compares: 0 },
        { contestItem: 'item2', wins: 0, compares: 0 },
        { contestItem: 'item3', wins: 1, compares: 1 },
        { contestItem: 'item4', wins: 0, compares: 1 },
      ];
      const finished = false;
      const round = 0;
      const pairNumber = 2;
      const pairsInRound = 2;
      const game = {
        ...gameBase,
        items: gameItems,
        round,
        pairNumber,
        pairsInRound,
        finished,
      } as Game;
      const updatedGame = gameService['playRoundUpdateGame'](game, winnerId);
      const winner = updatedGame.items.find(findItemById(winnerId));
      const looser = updatedGame.items.find(findItemById(looserId));

      expect(updatedGame.round).toEqual(round + 1);
      expect(updatedGame.pairNumber).toEqual(1);
      expect(updatedGame.finished).toEqual(finished);
      expect(updatedGame.pairsInRound).toEqual(1);

      expect(winner.wins).toEqual(1);
      expect(winner.compares).toEqual(1);

      expect(looser.wins).toEqual(0);
      expect(looser.compares).toEqual(1);
    });

    test('playRoundUpdateGame [round: (2 / 2) | pair: (1 / 1)]', () => {
      const gameItems = [
        { contestItem: 'item1', wins: 1, compares: 1 },
        { contestItem: 'item2', wins: 1, compares: 1 },
        { contestItem: 'item3', wins: 0, compares: 1 },
        { contestItem: 'item4', wins: 0, compares: 1 },
      ];
      const finished = false;
      const round = 1;
      const pairNumber = 1;
      const pairsInRound = 1;
      const game = {
        ...gameBase,
        items: gameItems,
        round,
        pairNumber,
        pairsInRound,
        finished,
      } as Game;
      const updatedGame = gameService['playRoundUpdateGame'](game, winnerId);
      const winner = updatedGame.items.find(findItemById(winnerId));
      const looser = updatedGame.items.find(findItemById(looserId));

      expect(updatedGame.round).toEqual(round + 1);
      expect(updatedGame.pairNumber).toEqual(0);
      expect(updatedGame.finished).toEqual(true);
      expect(updatedGame.pairsInRound).toEqual(0);

      expect(winner.wins).toEqual(2);
      expect(winner.compares).toEqual(2);

      expect(looser.wins).toEqual(1);
      expect(looser.compares).toEqual(2);
    });

    test('playRoundUpdateGame [already finished]', () => {
      const finished = true;
      const round = 1;
      const pairNumber = 1;
      const pairsInRound = 1;
      const game = {
        ...gameBase,
        items: getBaseGameItems(),
        round,
        pairNumber,
        pairsInRound,
        finished,
      } as Game;

      const throwable = () => {
        gameService['playRoundUpdateGame'](game, winnerId);
      };
      expect(throwable).toThrow(BadRequestException);
    });

    test('playRoundUpdateGame [wrong winner]', () => {
      const finished = false;
      const round = 1;
      const pairNumber = 1;
      const pairsInRound = 1;
      const game = {
        ...gameBase,
        items: getBaseGameItems(),
        round,
        pairNumber,
        pairsInRound,
        finished,
      } as Game;

      const throwable = () => {
        gameService['playRoundUpdateGame'](game, 'wrong');
      };
      expect(throwable).toThrow(BadRequestException);
    });
  });

  test('findById', async () => {
    const game = await gameService.findGameById(mockGames[0].id);
    expect(game).toMatchObject(mockGames[0]);
  });

  test('start', async () => {
    const contestId = mockContests[0].id;
    const game = await gameService.start(contestId);

    expect(game.contestId).toEqual(contestId);

    expect(game.round).toEqual(0);

    expect(game.finished).toEqual(false);

    expect(game.items.length).toBeGreaterThanOrEqual(2);

    expect(game.totalRounds).toEqual(
      game.items.length > 2 ? Math.sqrt(game.items.length) : 1,
    );
  });
});
