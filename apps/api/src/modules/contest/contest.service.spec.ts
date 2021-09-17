import { build, fake } from '@jackfranklin/test-data-bot';
import {
  ContestDto,
  ContestItemDto,
  GetContestsQuery,
  GetItemsQuery,
  PaginationQuery,
  SearchQuery,
} from '@lets-choose/common/dto';
import { CloudinaryService } from '@lets-choose/api/cloudinary';
import {
  ContestRepository,
  ContestItemRepository,
} from '@lets-choose/api/contest/data-access';
import { GameRepository } from '@lets-choose/api/game/data-access';
import { User, UserRepository } from '@lets-choose/api/user/data-access';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import faker from 'faker';

import {
  gameRepositoryMock,
  cloudinaryServiceMock,
  userRepositoryMock,
  contestRepositoryMock,
  contestItemRepositoryMock,
} from '@lets-choose/api/testing/mocks';
import {
  userBuilder,
  contestBuilder,
  contestItemBuilder,
} from '@lets-choose/api/testing/builders';
import {
  ContestService,
  CreateContestsData,
} from '@modules/contest/contest.service';

const paginatedResultBuilder = build({
  fields: {
    items: [],
    totalItems: fake((f) => f.random.number({ min: 1, precision: 1 })),
    totalPages: fake((f) => f.random.number({ min: 1, precision: 1 })),
    currentPage: fake((f) => f.random.number({ min: 1, precision: 1 })),
  },
});

const searchPaginationQueryBuilder = build<SearchQuery & PaginationQuery>({
  fields: {
    page: fake((f) => f.random.number({ min: 1, precision: 1 })),
    perPage: fake((f) => f.random.number({ min: 1, precision: 1 })),
    search: fake((f) => f.lorem.word()),
  },
});

describe('ContestService', () => {
  let contestService: ContestService;
  let contest: ContestDto;
  let contestItems: ContestItemDto[];
  let contestId: string;
  let mockContestPaginateResult;
  let mockContestItemsPaginateResult;
  let contestData;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContestService,
        {
          provide: ContestRepository,
          useValue: contestRepositoryMock,
        },
        {
          provide: ContestItemRepository,
          useValue: contestItemRepositoryMock,
        },
        {
          provide: CloudinaryService,
          useValue: cloudinaryServiceMock,
        },
        {
          provide: GameRepository,
          useValue: gameRepositoryMock,
        },
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    contestService = module.get<ContestService>(ContestService);

    user = userBuilder();
    contest = contestBuilder();
    contestItems = [
      contestItemBuilder(),
      contestItemBuilder(),
      contestItemBuilder(),
      contestItemBuilder(),
      contestItemBuilder(),
    ];
    ({ id: contestId } = contest);

    mockContestPaginateResult = paginatedResultBuilder({
      overrides: { items: [contest] },
    });

    mockContestItemsPaginateResult = paginatedResultBuilder({
      overrides: { items: contestItems },
    });

    contestData = {
      files: [
        { fieldname: 'thumbnail', path: 'path' },
        ...contestItems.map((_, i) => ({
          fieldname: `items[${i}][image]`,
          path: `items[${i}][image]`,
        })),
      ],
      title: faker.lorem.slug(),
      excerpt: faker.lorem.slug(),
      items: contestItems.map(({ title }) => ({ title })),
    } as CreateContestsData;

    jest
      .spyOn(mongoose.Types, 'ObjectId')
      .mockReturnValue({ toString: () => contestId } as any);

    contestRepositoryMock.findById.mockResolvedValue(contest);
    contestRepositoryMock.findByAuthor.mockResolvedValue([contest]);
    contestRepositoryMock.paginate.mockResolvedValue(
      mockContestPaginateResult as any,
    );
    contestItemRepositoryMock.paginate.mockResolvedValue(
      mockContestItemsPaginateResult as any,
    );
    contestRepositoryMock.findByIdAndUpdate.mockResolvedValue(contest);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('findById', async () => {
    const result = await contestService.findContestById(contestId);

    expect(result).toMatchObject(contest);
    expect(contestRepositoryMock.findById).toBeCalledWith(contestId);
  });

  test('getContestsPaginate', async () => {
    const options: GetContestsQuery = {
      ...searchPaginationQueryBuilder(),
      author: user.username,
      sortBy: faker.random.arrayElement(['NEWEST', 'POPULAR']),
    };
    userRepositoryMock.findByUsername.mockResolvedValue(user);
    const response = await contestService.getContestsPaginate(options);

    expect(response).toMatchObject(mockContestPaginateResult);
    expect(contestRepositoryMock.paginate).toBeCalledWith(options);
  });

  test('getContestItemsPaginate', async () => {
    const options: GetItemsQuery = searchPaginationQueryBuilder();
    const response = await contestService.getContestItemsPaginate(
      contestId,
      options,
    );

    expect(response).toMatchObject(mockContestItemsPaginateResult);
    expect(contestItemRepositoryMock.paginate).toBeCalledWith(
      contestId,
      options,
    );
  });

  test('findContestsByAuthor', async () => {
    const result = await contestService.findContestsByAuthor(user.id);

    expect(result).toMatchObject([contest]);
    expect(contestRepositoryMock.findByAuthor).toBeCalledWith(user.id);
  });

  test('createContest', async () => {
    contestRepositoryMock.createContest.mockResolvedValueOnce(contest);

    const result = await contestService.createContest(user.id, contestData);

    expect(contestRepositoryMock.createContest).toBeCalledWith({
      _id: contestId,
      author: user.id,
      title: contestData.title,
      excerpt: contestData.excerpt,
      thumbnail: `path:contests/${contestId}/thumbnail`,
    });

    expect(result).toEqual(contest);
    expect(cloudinaryServiceMock.upload).toBeCalledWith(
      'path',
      `contests/${contestId}/thumbnail`,
    );
  });

  test('updateContest', async () => {
    const result = await contestService.updateContest(contestId, contestData);

    expect(contestRepositoryMock.findByIdAndUpdate).toBeCalledWith(contestId, {
      title: contestData.title,
      excerpt: contestData.excerpt,
      thumbnail: `path:contests/${contestId}/thumbnail`,
    });

    expect(result).toEqual(contest);
    expect(cloudinaryServiceMock.upload).toBeCalledWith(
      'path',
      `contests/${contestId}/thumbnail`,
    );
  });

  test('removeContest', async () => {
    contestItemRepositoryMock.findByContestId.mockResolvedValueOnce(
      contestItems as any,
    );

    await contestService.removeContest(contestId);

    expect(contestRepositoryMock.deleteContest).toBeCalledWith(contestId);
    expect(cloudinaryServiceMock.destroy).toBeCalledWith(
      `contests/${contestId}/thumbnail`,
    );
    expect(cloudinaryServiceMock.destroyMultiple.mock.calls[0][0]).toHaveLength(
      contestItems.length,
    );
    expect(cloudinaryServiceMock.deleteFolder).toHaveBeenCalledWith(
      `contests/${contestId}`,
    );
    expect(contestItemRepositoryMock.deleteContestItems).toHaveBeenCalledWith(
      contestId,
    );
  });

  test('resetContest', async () => {
    contestRepositoryMock.findByIdAndUpdate.mockResolvedValueOnce(contest);

    const result = await contestService.resetContest(contestId);

    expect(contestRepositoryMock.findByIdAndUpdate).toHaveBeenCalledWith(
      contestId,
      { games: 0 },
    );
    expect(contestItemRepositoryMock.updateContestItems).toHaveBeenCalledWith(
      contestId,
      {
        games: 0,
        compares: 0,
        wins: 0,
        finalWins: 0,
      },
    );
    expect(gameRepositoryMock.deleteGames).toHaveBeenCalledWith(contestId);
    expect(result).toMatchObject(contest);
  });
});
