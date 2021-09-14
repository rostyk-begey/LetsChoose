import { IGameService } from '@abstract/game.service.interface';
import { Contest } from '@lets-choose/common/dto';
import contestRepository, {
  contestBuilder,
} from '@modules/contest/__mocks__/contest.repository';
import { ContestItem } from '@modules/contest/contest-item.entity';
import contestItemRepository, {
  contestItemBuilder,
} from '@modules/contest/__mocks__/contest-item.repository';
import { ContestItemRepository } from '@modules/contest/contest-item.repository';
import { ContestRepository } from '@modules/contest/contest.repository';
import gameRepository, {
  gameBuilder,
} from '@modules/game/__mocks__/game.repository';
import { GameItem } from '@modules/game/game-item.entity';
import { GameRepository } from '@modules/game/game.repository';
import { GameService } from '@modules/game/game.service';
import { oneOf } from '@jackfranklin/test-data-bot';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import lodash from 'lodash';

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
          useValue: contestRepository,
        },
        {
          provide: ContestItemRepository,
          useValue: contestItemRepository,
        },
        {
          provide: GameRepository,
          useValue: gameRepository,
        },
      ],
    }).compile();

    gameService = module.get<IGameService>(GameService);
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

      jest.spyOn(gameRepository, 'findById').mockResolvedValue(game);

      await gameService.playRound(game.id, winnerId);
    };

    describe('first round first pair', () => {
      const pairNumber = 0;
      beforeEach(() => setUp({ pairNumber }));

      afterEach(() => {
        gameRepository.findByIdAndUpdate.mockClear();
      });

      it('should get game from DB', () => {
        expect(gameRepository.findById).toHaveBeenCalledWith(game.id);
      });

      it('should update game', () => {
        const [gameId, updatedGame] =
          gameRepository.findByIdAndUpdate.mock.calls[0];

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
        gameRepository.findByIdAndUpdate.mockClear();
      });

      it('should get game from DB', () => {
        expect(gameRepository.findById).toHaveBeenCalledWith(game.id);
      });

      it('should update game', () => {
        const [gameId, updatedGame] =
          gameRepository.findByIdAndUpdate.mock.calls[0];

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
      let contest: Contest;
      let contestItem: ContestItem;
      let contestGames: number;

      beforeEach(async () => {
        contest = contestBuilder();
        ({ games: contestGames } = contest);
        contestItem = contestItemBuilder();
        contestRepository.findById.mockResolvedValue(contest);
        contestItemRepository.findById.mockResolvedValue(contestItem);

        await setUp({ round: 1 });
      });

      afterEach(() => {
        contestRepository.findById.mockClear();
        gameRepository.findByIdAndUpdate.mockClear();
      });

      it('should get game from DB', () => {
        expect(gameRepository.findById).toHaveBeenCalledWith(game.id);
      });

      it('should update game', () => {
        const [gameId, updatedGame] =
          gameRepository.findByIdAndUpdate.mock.calls[0];

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
        expect(contestRepository.findById).toHaveBeenCalledWith(game.contestId);
      });

      it('should update contest', () => {
        expect(contestRepository.findByIdAndUpdate).toHaveBeenCalledWith(
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
    gameRepository.findById.mockResolvedValueOnce(game);
    await gameService.findGameById(game.id);
    expect(gameRepository.findById).toHaveBeenCalledWith(game.id);
  });

  test('start', async () => {
    jest.spyOn(lodash, 'shuffle').mockImplementation((x) => x);

    const game = gameBuilder();
    const { id: gameId } = game;

    jest
      .spyOn(mongoose.Types, 'ObjectId')
      .mockReturnValue({ toString: () => gameId } as any);

    const contestItems = [
      contestItemBuilder(),
      contestItemBuilder(),
      contestItemBuilder(),
      contestItemBuilder(),
      contestItemBuilder(),
    ];
    const contest = contestBuilder();

    contestRepository.findById.mockResolvedValueOnce(contest);
    gameRepository.createGame.mockResolvedValueOnce(game);
    contestItemRepository.findByContestId.mockResolvedValueOnce(contestItems);

    const result = await gameService.start(contest.id);

    const gameItems: GameItem[] = contestItems.slice(0, 4).map(({ id }) => ({
      contestItem: id,
      wins: 0,
      compares: 0,
    }));

    expect(result).toEqual(game);
    expect(contestRepository.findById).toBeCalledWith(contest.id);
    expect(gameRepository.createGame).toHaveBeenCalledTimes(1);
    expect(gameRepository.createGame.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        _id: gameId,
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
