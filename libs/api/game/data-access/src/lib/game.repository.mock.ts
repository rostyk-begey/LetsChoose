import { IGameRepository } from '@lets-choose/api/abstract';

export const gameRepositoryMock: jest.Mocked<IGameRepository> = {
  all: jest.fn(),
  count: jest.fn(),
  count: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndRemove: jest.fn(),
  deleteGames: jest.fn(),
  create: jest.fn(),
};
