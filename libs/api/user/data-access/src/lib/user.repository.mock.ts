import { IUserRepository } from '@lets-choose/api/abstract';

export const userRepositoryMock: jest.Mocked<IUserRepository> = {
  findById: jest.fn(),
  findByIdOrFail: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByUsername: jest.fn(),
  findByEmail: jest.fn(),
  deleteUser: jest.fn(),
  createUser: jest.fn(),
};
