import { IGameRepository } from '../../../abstract/game.repository.interface';
import { GameItem } from '../game-item.entity';
import { Game } from '../game.entity';

const gameItem: GameItem = {
  contestItem: 'contestItemId',
  wins: 0,
  compares: 0,
};

export const game: Game = {
  pair: ['pair1', 'pair2'],
  finished: true,
  _id: 'gameId',
  id: 'gameId',
  contestId: 'contestId',
  pairsInRound: Math.random(),
  pairNumber: Math.random(),
  items: [gameItem, gameItem],
  round: Math.random(),
  totalRounds: Math.random(),
  winnerId: 'winnerId',
};

const gameRepository: jest.Mocked<IGameRepository> = {
  countDocuments: jest.fn().mockResolvedValue(1),
  aggregate: jest.fn().mockResolvedValue([game]),
  findById: jest.fn().mockResolvedValue(game),
  findByIdAndUpdate: jest.fn().mockResolvedValue(game),
  deleteGame: jest.fn().mockResolvedValue(game),
  deleteGames: jest.fn().mockResolvedValue(undefined),
  createGame: jest.fn().mockResolvedValue(game),
};

export default gameRepository;
