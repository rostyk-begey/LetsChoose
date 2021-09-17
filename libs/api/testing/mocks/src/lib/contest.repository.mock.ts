import { IContestRepository } from '@lets-choose/api/abstract';
import { ContestDto } from '@lets-choose/common/dto';

export const contest: ContestDto = {
  _id: 'contestId',
  games: 0,
  thumbnail: 'thumbnail',
  title: 'title',
  excerpt: 'excerpt',
  author: 'author',
  createdAt: new Date().toString(),
  id: 'contestId',
  items: [],
};

export const contestRepositoryMock: jest.Mocked<IContestRepository> = {
  countDocuments: jest.fn(),
  paginate: jest.fn(),
  findById: jest.fn(),
  findByAuthor: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteContest: jest.fn(),
  createContest: jest.fn(),
};
