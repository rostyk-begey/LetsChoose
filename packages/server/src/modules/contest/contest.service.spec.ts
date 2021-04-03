import { Test, TestingModule } from '@nestjs/testing';

import MockContestItemRepository from '../../../test/mocks/repositories/contest-item.repository';
import MockContestRepository, {
  mockContests,
} from '../../../test/mocks/repositories/contest.repository';
import MockGameRepository from '../../../test/mocks/repositories/game.repository';
import MockCloudinaryService from '../../../test/mocks/services/cloudinary.service';
import MockUserRepository from '../../../test/mocks/repositories/user.repository';
import { TYPES } from '../../injectable.types';

import { ContestService, CreateContestsData } from './contest.service';

describe('ContestService', () => {
  let contestService: ContestService;
  const contestId = mockContests[0].id;
  const thumbnail = `path:contests/${contestId}/thumbnail`;
  const contestData = {
    files: [
      { fieldname: 'thumbnail', path: 'path' },
      { fieldname: 'items[0][image]', path: 'item[0][image]' },
      { fieldname: 'items[1][image]', path: 'item[1][image]' },
    ],
    title: 'testContestTitle',
    excerpt: 'testContestExcerpt',
    items: [{ title: 'item0' }, { title: 'item1' }],
  } as CreateContestsData;

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
        {
          provide: TYPES.GameRepository,
          useValue: MockGameRepository,
        },
        {
          provide: TYPES.UserRepository,
          useValue: MockUserRepository,
        },
      ],
    }).compile();

    contestService = module.get<ContestService>(ContestService);
  });

  test('findById', async () => {
    const contest = await contestService.findContestById(contestId);

    expect(contest).toMatchObject(mockContests[0]);

    expect(MockContestRepository.findById).toBeCalledWith(contestId);
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

    expect(response.totalPages).toEqual(
      Math.ceil(mockContests.length / perPage),
    );

    expect(MockContestRepository.aggregate).toBeCalled();
  });

  test('findContestsByAuthor', async () => {
    const author = mockContests[0].author as string;
    const contest = await contestService.findContestsByAuthor(author);

    expect(contest).toMatchObject(
      mockContests.filter(({ author: a }) => a === author),
    );

    expect(MockContestRepository.findByAuthor).toBeCalledWith(author);
  });

  test('createContest', async () => {
    const userId = 'testUserId';

    await contestService.createContest(userId, contestData);
    const [contest] = await contestService.findContestsByAuthor(userId);
    const thumbnail = `path:contests/${contest.id}/thumbnail`;

    expect(MockContestRepository.createContest).toBeCalledWith({
      _id: contest._id,
      author: userId,
      title: contestData.title,
      excerpt: contestData.excerpt,
      thumbnail,
    });

    expect(contest.author).toEqual(userId);

    expect(contest.title).toEqual(contestData.title);

    expect(contest.excerpt).toEqual(contestData.excerpt);

    expect(contest.thumbnail).toEqual(thumbnail);

    expect(MockCloudinaryService.upload).toBeCalledWith(
      'path',
      `contests/${contest.id}/thumbnail`,
    );
  });

  test('updateContest', async () => {
    const contest = await contestService.updateContest(contestId, contestData);

    expect(MockContestRepository.findByIdAndUpdate).toBeCalledWith(contestId, {
      title: contestData.title,
      excerpt: contestData.excerpt,
      thumbnail: `path:contests/${contest.id}/thumbnail`,
    });

    expect(contest.title).toEqual(contestData.title);

    expect(contest.excerpt).toEqual(contestData.excerpt);

    expect(contest.thumbnail).toEqual(thumbnail);

    expect(MockCloudinaryService.upload).toBeCalledWith(
      'path',
      `contests/${contestId}/thumbnail`,
    );
  });

  test('removeContest', async () => {
    await contestService.removeContest(contestId);
    await contestService.findContestById(contestId).catch((e) => {
      expect(e).toBeInstanceOf(Error);
    });

    expect(MockContestRepository.deleteContest).toBeCalledWith(contestId);
  });
});
