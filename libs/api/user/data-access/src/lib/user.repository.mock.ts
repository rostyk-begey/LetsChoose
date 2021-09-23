import { IUserRepository } from '@lets-choose/api/abstract';

export const userRepositoryMock: jest.Mocked<IUserRepository> = {
  all: jest.fn(),
  count: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByUsername: jest.fn(),
  findByEmail: jest.fn(),
  findByIdAndRemove: jest.fn(),
  create: jest.fn(),
};
