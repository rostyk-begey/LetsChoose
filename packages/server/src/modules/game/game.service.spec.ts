import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import contestRepository, {
  contest,
} from '../contest/__mocks__/contest.repository';
import contestItemRepository from '../contest/__mocks__/contest-item.repository';
import gameRepository, { game } from '../game/__mocks__/game.repository';
import { TYPES } from '../../injectable.types';
import { ContestItem } from '../contest/contest-item.entity';
import { GameItem } from './game-item.entity';
import { Game } from './game.entity';
import { GameService } from './game.service';

describe('GameService', () => {
  let gameService: GameService;
  const { id: contestId } = contest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    gameService = module.get<GameService>(GameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateTotalRounds', () => {
    test.each`
      length | expected
      ${16}  | ${4}
      ${8}   | ${3}
      ${4}   | ${2}
      ${2}   | ${1}
    `(
      'calculateTotalRounds($length) returns $expected',
      async ({ length, expected }) => {
        expect(GameService['calculateTotalRounds'](length)).toEqual(expected);
      },
    );
  });

  describe('calculateGameLength', () => {
    test.each`
      length | expected
      ${17}  | ${16}
      ${16}  | ${16}
      ${15}  | ${8}
      ${9}   | ${8}
      ${8}   | ${8}
      ${5}   | ${4}
      ${4}   | ${4}
      ${2}   | ${2}
    `(
      'calculateGameItemsLength($length) returns',
      async ({ length, expected }) => {
        expect(GameService['calculateGameItemsLength'](length)).toEqual(
          expected,
        );
      },
    );
  });

  const getGameItemsPerRound = (
    round = 0,
    pair = 0,
    length = 4,
  ): GameItem[] => {
    const gameItems: GameItem[] = Array.from({ length }, (_, i) => ({
      contestItem: `item-${i + 1}`,
      wins: i < length / 2 ? round : 0,
      compares: round,
    }));

    return gameItems.map((gameItem, i) => {
      if (i < pair * 2) {
        gameItem.compares += 1;
      }
      if (i < pair) {
        gameItem.wins += 1;
      }

      return gameItem;
    });
  };

  // FIXME: update gameService play round
  describe.skip('playRound', () => {
    const getContestItem = (index) => ({
      _id: `item-${index}`,
      id: `item-${index}`,
      title: `item-${index}`,
      image: `item-${index}`,
      contestId: `contest-${index}`,
      finalWins: 0,
      wins: 0,
      games: 0,
      compares: 0,
    });
    const pair: ContestItem[] = [getContestItem(0), getContestItem(1)];
    const getBaseGameItems = (length = 4): GameItem[] => {
      return Array.from({ length }, (_, i) => ({
        contestItem: `item-${i}`,
        wins: 0,
        compares: 0,
      }));
    };
    const gameBase: Partial<Game> = {
      _id: 'game-1',
      id: 'game-1',
      contestId: 'contest-1',
      winnerId: undefined,
      totalRounds: 2,
    };
    const findItemById = (id) => ({ contestItem }) => contestItem === id;
    const looserId = 'item2';

    describe.each`
      round | pairNumber | pairsInRound | expectedFinished
      ${0}  | ${0}       | ${2}         | ${false}
      ${0}  | ${1}       | ${2}         | ${false}
      ${1}  | ${0}       | ${1}         | ${true}
    `(
      'playRound [round: ($round / 2) | pair: ($pairNumber / $pairsInRound)]',
      ({ expectedFinished, round, pairNumber, pairsInRound }) => {
        const items = getGameItemsPerRound(round, pairNumber);
        const game = {
          ...gameBase,
          items,
          round,
          pairNumber,
          pairsInRound,
          finished: false,
          pair,
        } as Game;
        let updatedItems;
        let updatedGame;
        let winnerId;
        let looserId;
        let actualWinner;
        let expectedWinner;
        let actualLooser;
        let expectedLooser;

        beforeAll(async () => {
          jest.spyOn(gameRepository, 'findById').mockResolvedValueOnce(game);
          [{ id: winnerId }, { id: looserId }] = pair;

          await gameService.playRound(game.id, winnerId);

          ({
            items: updatedItems,
            ...updatedGame
          } = gameRepository.findByIdAndUpdate.mock.calls[0][1]);

          actualWinner = updatedItems.find(findItemById(winnerId));
          expectedWinner = items.find(findItemById(winnerId));
          actualLooser = updatedItems.find(findItemById(looserId));
          expectedLooser = items.find(findItemById(looserId));
          console.log(items);
          console.log(winnerId);
          console.log(updatedItems);
        });

        afterAll(() => {
          // pair = updatedGame.pair.map((itemId: string) =>
          //   getContestItem(itemId.split('-').pop()),
          // );
        });
        // const mockShuffle = jest.fn().mockImplementation((items) => items);
        // jest.mock('lodash/shuffle');
        // jest.mock('lodash/shuffle', () => ({
        //   shuffle: mockShuffle,
        // }));

        it('should update game correctly', () => {
          // expect(shuffle).toHaveBeenCalled();
          // expect(gameRepository.findByIdAndUpdate).toHaveBeenCalledWith({
          //   ...gameBase,
          //   round,
          //   pairNumber: pairNumber + 1,
          //   finished: expectedFinished,
          //   pairsInRound,
          // });

          expect(updatedGame.round).toEqual(round);
          expect(updatedGame.pairNumber).toEqual(pairNumber + 1);
          expect(updatedGame.finished).toEqual(expectedFinished);
          expect(updatedGame.pairsInRound).toEqual(pairsInRound);
        });

        it('should update winner correctly', () => {
          expect(actualWinner).toMatchObject({
            ...expectedWinner,
            wins: expectedWinner.wins + 1,
            compares: expectedWinner.compares + 1,
          });
        });

        it('should update looser correctly', () => {
          expect(actualLooser).toMatchObject({
            ...expectedLooser,
            compares: expectedLooser.compares + 1,
          });
        });

        expect(gameRepository.findByIdAndUpdate.mock.calls[0][0]).toEqual(
          game.id,
        );

        it('should not update reset items', () => {
          const getRestItems = (items) => {
            return items.filter(
              ({ contestItem }) =>
                ![winnerId, looserId].includes(contestItem as string),
            );
          };
          const actualRestItems = getRestItems(game.items);
          const expectedRestItems = getRestItems(items);
          expect(actualRestItems).toMatchObject(expectedRestItems);
        });

        // if (finished) {
        //   expect(contestRepository.findById).toHaveBeenCalledWith(
        //     game.contestId,
        //   );
        //   expect(
        //     contestRepository.findByIdAndUpdate.mock.calls[0][1].games,
        //   ).toEqual(contest.games + 1);
        //
        //   game.items.forEach(({ contestItem: itemId, compares, wins }) => {
        //     expect(contestItemRepository.findById).toHaveBeenCalledWith(itemId);
        //     expect(
        //       contestItemRepository.findByIdAndUpdate,
        //     ).toHaveBeenCalledWith(itemId, {
        //       compares: 1,
        //       wins: 1,
        //       games: 1,
        //       finalWins: 1,
        //     });
        //   });
        // }
      },
    );

    // test('playRoundUpdateGame [round: (1 / 2) | pair: (1 / 2)]', () => {
    //   const finished = false;
    //   const round = 0;
    //   const pairNumber = 1;
    //   const pairsInRound = 2;
    //   const game = {
    //     ...gameBase,
    //     items: getBaseGameItems(),
    //     round,
    //     pairNumber,
    //     pairsInRound,
    //     finished,
    //   } as Game;
    //   const updatedGame = gameService['playRoundUpdateGame'](game, winnerId);
    //   const winner = updatedGame.items.find(findItemById(winnerId));
    //   const looser = updatedGame.items.find(findItemById(looserId));
    //   const item3 = updatedGame.items.find(findItemById('item3'));
    //   const item4 = updatedGame.items.find(findItemById('item4'));
    //
    //   expect(updatedGame.round).toEqual(round);
    //   expect(updatedGame.pairNumber).toEqual(pairNumber + 1);
    //   expect(updatedGame.finished).toEqual(finished);
    //   expect(updatedGame.pairsInRound).toEqual(pairsInRound);
    //
    //   expect(winner.wins).toEqual(1);
    //   expect(winner.compares).toEqual(1);
    //
    //   expect(looser.wins).toEqual(0);
    //   expect(looser.compares).toEqual(1);
    //
    //   expect(item3).toMatchObject(getBaseGameItems()[2]);
    //   expect(item4).toMatchObject(getBaseGameItems()[3]);
    // });
    //
    // test('playRoundUpdateGame [round: (1 / 2) | pair: (2 / 2)]', () => {
    //   const gameItems = [
    //     { contestItem: 'item1', wins: 0, compares: 0 },
    //     { contestItem: 'item2', wins: 0, compares: 0 },
    //     { contestItem: 'item3', wins: 1, compares: 1 },
    //     { contestItem: 'item4', wins: 0, compares: 1 },
    //   ];
    //   const finished = false;
    //   const round = 0;
    //   const pairNumber = 2;
    //   const pairsInRound = 2;
    //   const game = {
    //     ...gameBase,
    //     items: gameItems,
    //     round,
    //     pairNumber,
    //     pairsInRound,
    //     finished,
    //   } as Game;
    //   const updatedGame = gameService['playRoundUpdateGame'](game, winnerId);
    //   const winner = updatedGame.items.find(findItemById(winnerId));
    //   const looser = updatedGame.items.find(findItemById(looserId));
    //
    //   expect(updatedGame.round).toEqual(round + 1);
    //   expect(updatedGame.pairNumber).toEqual(1);
    //   expect(updatedGame.finished).toEqual(finished);
    //   expect(updatedGame.pairsInRound).toEqual(1);
    //
    //   expect(winner.wins).toEqual(1);
    //   expect(winner.compares).toEqual(1);
    //
    //   expect(looser.wins).toEqual(0);
    //   expect(looser.compares).toEqual(1);
    // });
    //
    // test('playRoundUpdateGame [round: (2 / 2) | pair: (1 / 1)]', () => {
    //   const gameItems = [
    //     { contestItem: 'item1', wins: 1, compares: 1 },
    //     { contestItem: 'item2', wins: 1, compares: 1 },
    //     { contestItem: 'item3', wins: 0, compares: 1 },
    //     { contestItem: 'item4', wins: 0, compares: 1 },
    //   ];
    //   const finished = false;
    //   const round = 1;
    //   const pairNumber = 1;
    //   const pairsInRound = 1;
    //   const game = {
    //     ...gameBase,
    //     items: gameItems,
    //     round,
    //     pairNumber,
    //     pairsInRound,
    //     finished,
    //   } as Game;
    //   const updatedGame = gameService['playRoundUpdateGame'](game, winnerId);
    //   const winner = updatedGame.items.find(findItemById(winnerId));
    //   const looser = updatedGame.items.find(findItemById(looserId));
    //
    //   expect(updatedGame.round).toEqual(round + 1);
    //   expect(updatedGame.pairNumber).toEqual(0);
    //   expect(updatedGame.finished).toEqual(true);
    //   expect(updatedGame.pairsInRound).toEqual(0);
    //
    //   expect(winner.wins).toEqual(2);
    //   expect(winner.compares).toEqual(2);
    //
    //   expect(looser.wins).toEqual(1);
    //   expect(looser.compares).toEqual(2);
    // });

    test('playRound [already finished]', async () => {
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

      try {
        await gameService.playRound(game.id, 'item-1');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });

    test('playRoundUpdateGame [wrong winner]', async () => {
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

      try {
        await gameService.playRound(game.id, 'wrong');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  test('findById', async () => {
    const result = await gameService.findGameById(contestId);
    expect(result).toMatchObject(game);
  });

  test('start', async () => {
    const result = await gameService.start(contestId);
    jest.mock('mongoose', () => ({
      Types: {
        ObjectId: jest.fn().mockReturnValue(game.id),
      },
    }));

    expect(result).toEqual(game);
    expect(contestRepository.findById).toBeCalledWith(contestId);
    expect(gameRepository.createGame.mock.calls[0][0]).toMatchObject({
      contestId,
      items: contest.items.map(({ id }) => ({
        contestItem: id,
        wins: 0,
        compares: 0,
      })),
      finished: false,
      round: 0,
      pairNumber: 1,
      pairsInRound: contest.items.length / 2,
      totalRounds: Math.log2(contest.items.length),
      pair: contest.items.map(({ id }) => id),
    });
  });
});
