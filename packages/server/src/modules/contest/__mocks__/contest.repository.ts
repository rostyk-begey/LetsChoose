import { Contest } from '@lets-choose/common';
import { IContestRepository } from '../../../abstract/contest.repository.interface';
import { contestItem } from './contest-item.repository';

export const contest: Contest = {
  _id: 'contestId',
  games: 0,
  thumbnail: 'thumbnail',
  title: 'title',
  excerpt: 'excerpt',
  author: 'author',
  createdAt: new Date().toString(),
  id: 'contestId',
  items: [contestItem],
};

const contestRepository: jest.Mocked<IContestRepository> = {
  countDocuments: jest.fn().mockResolvedValue(1),
  paginate: jest.fn().mockResolvedValue({
    items: [contest],
    currentPage: 1,
    totalPages: 1,
    totalItems: 1,
  }),
  findById: jest.fn().mockResolvedValue(contest),
  findByAuthor: jest.fn().mockResolvedValue(contest),
  findByIdAndUpdate: jest.fn().mockResolvedValue(contest),
  deleteContest: jest.fn().mockResolvedValue(contest),
  createContest: jest.fn().mockResolvedValue(contest),
};

export default contestRepository;
