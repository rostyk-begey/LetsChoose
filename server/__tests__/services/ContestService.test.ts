import container from '../container';
import mockContests from '../__mocks__/repositories/data/contests';
import { TYPES } from '../../inversify.types';
import ContestService from '../../services/ContestService';
import { GetResponse } from '../../controllers/contest/types';
import { Contest } from '../../models/Contest';
import CloudinaryService from '../__mocks__/services/CloudinaryService';

let contestService: ContestService = container.get<ContestService>(
  TYPES.ContestService,
);

beforeEach(() => {
  contestService = container.get<ContestService>(TYPES.ContestService);
});

test('Test ContestService findById', async () => {
  const contest = await contestService.findContestById(mockContests[0].id);
  expect(contest).toMatchObject(mockContests[0]);
});

describe('Test ContestService getContestsPaginate', () => {
  const page = 1;
  const perPage = 5;
  let response: GetResponse;

  beforeAll(async () => {
    response = await contestService.getContestsPaginate({
      page,
      perPage,
      author: '',
      sortBy: 'NEWEST',
      search: '',
    });
  });

  test('test current page', () => {
    expect(response.currentPage).toEqual(page);
  });

  test('test total pages', () => {
    expect(response.totalPages).toEqual(
      Math.ceil(mockContests.length / perPage),
    );
  });
});

test('Test ContestService findContestsByAuthor', async () => {
  const author = mockContests[0].author as string;
  const contest = await contestService.findContestsByAuthor(author);

  expect(contest).toMatchObject(
    mockContests.filter(({ author: a }) => a === author),
  );
});

const contestData = {
  files: [
    { fieldname: 'thumbnail', path: 'path' },
    { fieldname: 'items[0][image]', path: 'item[0][image]' },
    { fieldname: 'items[1][image]', path: 'item[1][image]' },
  ],
  title: 'testContestTitle',
  excerpt: 'testContestExcerpt',
  items: [{ title: 'item0' }, { title: 'item1' }],
};

describe('Test ContestService createContest', () => {
  const userId = 'testUserId';

  let contest: Contest;

  beforeAll(async () => {
    await contestService.createContest(userId, contestData);
    [contest] = await contestService.findContestsByAuthor(userId);
  });

  test('test new contest author', () => {
    expect(contest.author).toEqual(userId);
  });

  test('test new contest title', () => {
    expect(contest.title).toEqual(contestData.title);
  });

  test('test new contest excerpt', () => {
    expect(contest.excerpt).toEqual(contestData.excerpt);
  });

  test('test new contest thumbnail', () => {
    expect(contest.thumbnail).toEqual(`contests/${contest.id}/thumbnail`);
  });

  test('test called cloudinary service', () => {
    expect(CloudinaryService.upload).toBeCalledWith(
      'path',
      `contests/${contest.id}/thumbnail`,
    );
  });
});

describe('Test ContestService updateContest', () => {
  let contest: Contest;

  beforeAll(async () => {
    contest = await contestService.updateContest(
      mockContests[0].id,
      contestData,
    );
  });

  test('test updated contest title', () => {
    expect(contest.title).toEqual(contestData.title);
  });

  test('test updated contest excerpt', () => {
    expect(contest.excerpt).toEqual(contestData.excerpt);
  });

  test('test updated contest thumbnail', () => {
    expect(contest.thumbnail).toEqual(`contests/${contest.id}/thumbnail`);
  });

  test('test called cloudinary service', () => {
    expect(CloudinaryService.upload).toBeCalledWith(
      'path',
      `contests/${contest.id}/thumbnail`,
    );
  });
});

test('Test remove contest', async () => {
  const contestId = mockContests[0].id;
  await contestService.removeContest(contestId);
  await contestService.findContestById(contestId).catch((e) => {
    expect(e).toBeInstanceOf(Error);
  });
});
