import { Test, TestingModule } from '@nestjs/testing';

import MockContestItemRepository from '../../../test/mocks/repositories/ContestItemRepository';
import MockContestRepository, {
  mockContests,
} from '../../../test/mocks/repositories/ContestRepository';
import MockCloudinaryService from '../../../test/mocks/services/CloudinaryService';
import { TYPES } from '../../injectable.types';

import { ContestService } from './contest.service';

describe('ContestService', () => {
  let contestService: ContestService;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContestService,
        {
          provide: TYPES.ContestRepository,
          useValue: MockContestRepository,
        },
        {
          provide: TYPES.ContestItemRepository,
          useValue: MockContestItemRepository,
        },
        {
          provide: TYPES.CloudinaryService,
          useValue: MockCloudinaryService,
        },
      ],
    }).compile();

    contestService = module.get<ContestService>(ContestService);
  });

  test('findById', async () => {
    const contest = await contestService.findContestById(mockContests[0].id);
    expect(contest).toMatchObject(mockContests[0]);
  });

  test('getContestsPaginate', async () => {
    const page = 1;
    const perPage = 5;
    const response = await contestService.getContestsPaginate({
      page,
      perPage,
      author: '',
      sortBy: 'NEWEST',
      search: '',
    });

    expect(response.currentPage).toEqual(page);
    // test('test current page', () => {
    // });

    expect(response.totalPages).toEqual(
      Math.ceil(mockContests.length / perPage),
    );
    // test('test total pages', () => {
    // });
  });

  test('findContestsByAuthor', async () => {
    const author = mockContests[0].author as string;
    const contest = await contestService.findContestsByAuthor(author);

    expect(contest).toMatchObject(
      mockContests.filter(({ author: a }) => a === author),
    );
  });

  test('createContest', async () => {
    const userId = 'testUserId';

    await contestService.createContest(userId, contestData);
    const [contest] = await contestService.findContestsByAuthor(userId);

    expect(contest.author).toEqual(userId);
    // test('test new contest author', () => {
    // });

    expect(contest.title).toEqual(contestData.title);
    // test('test new contest title', () => {
    // });

    expect(contest.excerpt).toEqual(contestData.excerpt);
    // test('test new contest excerpt', () => {
    // });

    expect(contest.thumbnail).toEqual(`contests/${contest.id}/thumbnail`);
    // test('test new contest thumbnail', () => {
    // });

    expect(MockCloudinaryService.upload).toBeCalledWith(
      'path',
      `contests/${contest.id}/thumbnail`,
    );
    // test('test called cloudinary service', () => {
    // });
  });

  test('updateContest', async () => {
    const contest = await contestService.updateContest(
      mockContests[0].id,
      contestData,
    );

    expect(contest.title).toEqual(contestData.title);
    // test('test updated contest title', () => {
    // });

    expect(contest.excerpt).toEqual(contestData.excerpt);
    // test('test updated contest excerpt', () => {
    // });

    expect(contest.thumbnail).toEqual(`contests/${contest.id}/thumbnail`);
    // test('test updated contest thumbnail', () => {
    // });

    expect(MockCloudinaryService.upload).toBeCalledWith(
      'path',
      `contests/${contest.id}/thumbnail`,
    );
    // test('test called cloudinary service', () => {
    // });
  });

  test('removeContest', async () => {
    const contestId = mockContests[0].id;
    await contestService.removeContest(contestId);
    await contestService.findContestById(contestId).catch((e) => {
      expect(e).toBeInstanceOf(Error);
    });
  });
});
