import { IContestRepository } from '@lets-choose/api/abstract';

export const contestRepositoryMock: jest.Mocked<IContestRepository> = {
  all: jest.fn(),
  count: jest.fn(),
  countByAuthor: jest.fn(),
  paginate: jest.fn(),
  findById: jest.fn(),
  findByAuthor: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndRemove: jest.fn(),
  create: jest.fn(),
};
