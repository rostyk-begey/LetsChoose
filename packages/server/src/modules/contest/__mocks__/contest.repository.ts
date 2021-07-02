import { build, fake, sequence } from '@jackfranklin/test-data-bot';
import { Contest } from '@lets-choose/common';
import { IContestRepository } from '@abstract/contest.repository.interface';

export const contest: Contest = {
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

export const contestBuilder = build<Contest>({
  fields: {
    _id: sequence((i) => `contest-${i}`),
    id: sequence((i) => `contest-${i}`),
    games: fake((f) => f.random.number({ min: 0, precision: 1 })),
    thumbnail: fake((f) => f.image.image()),
    title: fake((f) => f.lorem.slug()),
    excerpt: fake((f) => f.lorem.slug()),
    author: fake((f) => f.internet.userName()),
    createdAt: fake((f) => f.date.past().toString()),
    items: [],
  },
  postBuild: (res) => ({
    ...res,
    id: res._id,
  }),
});

const contestRepository: jest.Mocked<IContestRepository> = {
  countDocuments: jest.fn(),
  paginate: jest.fn(),
  findById: jest.fn(),
  findByAuthor: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteContest: jest.fn(),
  createContest: jest.fn(),
};

export default contestRepository;
