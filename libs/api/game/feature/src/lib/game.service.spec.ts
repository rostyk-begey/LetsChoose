import { oneOf } from '@jackfranklin/test-data-bot';
import { IGameService } from '@lets-choose/api/abstract';
import {
  ContestItem,
  ContestItemRepository,
  ContestRepository,
} from '@lets-choose/api/contest/data-access';
import { GameItem, GameRepository } from '@lets-choose/api/game/data-access';
import {
  contestBuilder,
  contestItemBuilder,
  gameBuilder,
} from '@lets-choose/api/testing/builders';
import { ContestDto } from '@lets-choose/common/dto';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import lodash from 'lodash';
import mongoose from 'mongoose';
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { contestItemRepositoryMock } from '../../../../contest/data-access/src/lib/contest-item.repository.mock';
import { contestRepositoryMock } from '../../../../contest/data-access/src/lib/contest.repository.mock';
import { gameRepositoryMock } from '../../../data-access/src/lib/game.repository.mock';
import { GameService } from './game.service';

const getGameItemsPerRound = ({
  round = 0,
  pair = 0,
  length = 4,
} = {}): GameItem[] => {
  const gameItems: GameItem[] = Array.from({ length }, (_, i) => ({
    contestItem: `contest-item-${i}`,
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

const updateGameItems = (
  items: GameItem[],
  winnerId: string,
  looserId: string,
) => {
  return items.map((item) => {
    const result = { ...item };
    if (item.contestItem === winnerId) {
      result.compares += 1;
      result.wins += 1;
    } else if (item.contestItem === looserId) {
      result.compares += 1;
    }
    return result;
  });
};

describe('GameService', () => {
  let gameService: IGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    gameService = module.get<IGameService>(GameService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('playRound', () => {
    let game;
    let updatedItems;

    const setUp = async ({ round = 0, pairNumber = 0 } = {}) => {
      const items = getGameItemsPerRound({ round, pair: pairNumber });
      const pair: ContestItem[] = items
        .filter(({ compares, wins }) => round === compares && round === wins)
        .slice(0, 2)
        .map(({ contestItem }) => ({
          ...contestItemBuilder(),
          _id: contestItem as string,
          id: contestItem as string,
        }));
      const [{ id: winnerId }, { id: looserId }] = pair;
      updatedItems = updateGameItems(items, winnerId, looserId);
      game = gameBuilder({
        overrides: {
          items,
          round,
          pairNumber,
          pairsInRound: 2,
          pair,
        },
      });

      jest.spyOn(gameRepositoryMock, 'findById').mockResolvedValue(game);

      await gameService.playRound(game.id, winnerId);
    };

    describe('first round first pair', () => {
      const pairNumber = 0;

      beforeEach(() => setUp({ pairNumber }));

      afterEach(() => {
        gameRepositoryMock.findByIdAndUpdate.mockClear();
      });

      it('should get game from DB', () => {
        expect(gameRepositoryMock.findById).toHaveBeenCalledWith(game.id);
      });

      it('should update game', () => {
        const [gameId, updatedGame] =
          gameRepositoryMock.findByIdAndUpdate.mock.calls[0];

        expect(gameId).toEqual(game.id);
        expect(updatedGame).toEqual(
          expect.objectContaining({
            ...game,
            items: updatedItems,
            pairNumber: pairNumber + 1,
          }),
        );
      });
    });

    describe('first round last pair', () => {
      const pairNumber = 1;
      beforeEach(() => setUp({ pairNumber }));

      afterEach(() => {
        gameRepositoryMock.findByIdAndUpdate.mockClear();
      });

      it('should get game from DB', () => {
        expect(gameRepositoryMock.findById).toHaveBeenCalledWith(game.id);
      });

      it('should update game', () => {
        const [gameId, updatedGame] =
          gameRepositoryMock.findByIdAndUpdate.mock.calls[0];

        expect(gameId).toEqual(game.id);
        expect(updatedGame).toEqual(
          expect.objectContaining({
            ...game,
            items: updatedItems,
            round: 1,
            pairNumber: 0,
          }),
        );
      });
    });

    describe('last round', () => {
      let contest: ContestDto;
      let contestItem: ContestItem;
      let contestGames: number;

      beforeEach(async () => {
        contest = contestBuilder();
        ({ games: contestGames } = contest);
        contestItem = contestItemBuilder();
        contestRepositoryMock.findById.mockResolvedValue(contest);
        contestItemRepositoryMock.findById.mockResolvedValue(contestItem);

        await setUp({ round: 1 });
      });

      afterEach(() => {
        contestRepositoryMock.findById.mockClear();
        gameRepositoryMock.findByIdAndUpdate.mockClear();
      });

      it('should get game from DB', () => {
        expect(gameRepositoryMock.findById).toHaveBeenCalledWith(game.id);
      });

      it('should update game', () => {
        const [gameId, updatedGame] =
          gameRepositoryMock.findByIdAndUpdate.mock.calls[0];

        expect(gameId).toEqual(game.id);
        expect(updatedGame).toEqual(
          expect.objectContaining({
            ...game,
            items: updatedItems,
            finished: true,
            round: 2,
            pairNumber: -1,
          }),
        );
      });

      it('should get contest from DB', () => {
        expect(contestRepositoryMock.findById).toHaveBeenCalledWith(
          game.contestId,
        );
      });

      it('should update contest', () => {
        expect(contestRepositoryMock.findByIdAndUpdate).toHaveBeenCalledWith(
          contest.id,
          {
            ...contest,
            games: contestGames + 1,
          },
        );
      });

      it.todo('should update contest items');
    });

    test('playRound [already finished]', async () => {
      const game = gameBuilder({ overrides: { finished: oneOf(true) } });
      expect.assertions(1);

      try {
        await gameService.playRound(game.id, 'item-1');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });

    test('playRoundUpdateGame [wrong winner]', async () => {
      const game = gameBuilder();
      expect.assertions(1);

      try {
        await gameService.playRound(game.id, 'wrong');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  test('findById', async () => {
    const game = gameBuilder();
    gameRepositoryMock.findById.mockResolvedValueOnce(game as any);
    await gameService.findGameById(game.id);
    expect(gameRepositoryMock.findById).toHaveBeenCalledWith(game.id);
  });

  describe('start', () => {
    let game;
    let gameId;
    let result;
    let contest;
    let contestItems;

    beforeAll(async () => {
      jest.spyOn(lodash, 'shuffle').mockImplementation((x) => x);

      game = gameBuilder();
      ({ id: gameId } = game);

      jest
        .spyOn(mongoose.Types, 'ObjectId')
        .mockReturnValue({ toString: () => gameId } as any);

      contestItems = [
        contestItemBuilder(),
        contestItemBuilder(),
        contestItemBuilder(),
        contestItemBuilder(),
        contestItemBuilder(),
      ];
      contest = contestBuilder();

      contestRepositoryMock.findById.mockResolvedValue(contest);
      gameRepositoryMock.create.mockResolvedValue(game);
      gameRepositoryMock.findById.mockResolvedValue(game);
      contestItemRepositoryMock.findByContestId.mockResolvedValue(contestItems);

      result = await gameService.start(contest.id);
    });

    it('should return correct game', () => {
      expect(result).toEqual(game);
    });

    it('should call "ContestRepository.findById"', () => {
      expect(contestRepositoryMock.findById).toBeCalledWith(contest.id);
    });

    it('should call "GameRepository.createGame"', () => {
      const gameItems: GameItem[] = contestItems.slice(0, 4).map(({ id }) => ({
        contestItem: id,
        wins: 0,
        compares: 0,
      }));

      expect(gameRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(gameRepositoryMock.create.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          contestId: contest.id,
          items: gameItems,
          finished: false,
          round: 0,
          pairNumber: 0,
          pairsInRound: gameItems.length / 2,
          totalRounds: Math.log2(gameItems.length),
          pair: gameItems.slice(0, 2).map(({ contestItem }) => contestItem),
        }),
      );
    });
  });
});
