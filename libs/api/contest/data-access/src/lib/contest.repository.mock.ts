import { IContestRepository } from '@lets-choose/api/abstract';

export const contestRepositoryMock: jest.Mocked<IContestRepository> = {
  countDocuments: jest.fn(),
  paginate: jest.fn(),
  findById: jest.fn(),
  findByAuthor: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteContest: jest.fn(),
  createContest: jest.fn(),
};
