import { IGameRepository } from '@lets-choose/api/abstract';

export const gameRepositoryMock: jest.Mocked<IGameRepository> = {
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteGame: jest.fn(),
  deleteGames: jest.fn(),
  createGame: jest.fn(),
};
