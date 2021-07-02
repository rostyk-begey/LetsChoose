import { IGameRepository } from '@abstract/game.repository.interface';
import { build, fake, oneOf, sequence } from '@jackfranklin/test-data-bot';
import { Game } from '@modules/game/game.entity';

export const gameBuilder = build<Game>({
  fields: {
    _id: sequence((i) => `game-${i}`),
    id: sequence((i) => `game-${i}`),
    contestId: sequence((i) => `contest-${i}`),
    winnerId: undefined,
    finished: oneOf(false),
    totalRounds: 2,
    items: [],
    round: 0,
    pairNumber: 0,
    pairsInRound: 2,
    pair: [],
  },
  postBuild: (res) => ({
    ...res,
    id: res._id,
  }),
  traits: {
    finished: {
      overrides: {
        winnerId: sequence((i) => `contest-item-${i}`),
        finished: fake(() => true),
      },
    },
  },
});

const gameRepository: jest.Mocked<IGameRepository> = {
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteGame: jest.fn(),
  deleteGames: jest.fn(),
  createGame: jest.fn(),
};

export default gameRepository;
