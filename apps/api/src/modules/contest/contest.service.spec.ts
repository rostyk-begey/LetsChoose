import { build, fake } from '@jackfranklin/test-data-bot';
import {
  ContestDto,
  ContestItem,
  GetContestsQuery,
  GetItemsQuery,
  PaginationQuery,
  SearchQuery,
} from '@lets-choose/common/dto';
import { CloudinaryService } from '@modules/cloudinary/cloudinary.service';
import { ContestItemRepository } from '../../../../../libs/api/contest/data-access/src/lib/contest-item.repository';
import { ContestRepository } from '../../../../../libs/api/contest/data-access/src/lib/contest.repository';
import { GameRepository } from '@modules/game/game.repository';
import { UserRepository } from '../../../../../libs/api/user/data-access/src/lib/user.repository';
import { User } from '../../../../../libs/api/user/data-access/src/lib/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import faker from 'faker';

import gameRepository from '@modules/game/__mocks__/game.repository';
import cloudinaryService from '@modules/cloudinary/__mocks__/cloudinary.service';
import userRepository, {
  userBuilder,
} from '@modules/user/__mocks__/user.repository';
import contestRepository, {
  contestBuilder,
} from '@modules/contest/__mocks__/contest.repository';
import contestItemRepository, {
  contestItemBuilder,
} from '@modules/contest/__mocks__/contest-item.repository';
import {
  ContestService,
  CreateContestsData,
} from '@modules/contest/contest.service';
import { TYPES } from '@src/injectable.types';

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
  let contestItems: ContestItem[];
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
          useValue: contestRepository,
        },
        {
          provide: ContestItemRepository,
          useValue: contestItemRepository,
        },
        {
          provide: CloudinaryService,
          useValue: cloudinaryService,
        },
        {
          provide: GameRepository,
          useValue: gameRepository,
        },
        {
          provide: UserRepository,
          useValue: userRepository,
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

    contestRepository.findById.mockResolvedValue(contest);
    contestRepository.findByAuthor.mockResolvedValue([contest]);
    contestRepository.paginate.mockResolvedValue(
      mockContestPaginateResult as any,
    );
    contestItemRepository.paginate.mockResolvedValue(
      mockContestItemsPaginateResult as any,
    );
    contestRepository.findByIdAndUpdate.mockResolvedValue(contest);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('findById', async () => {
    const result = await contestService.findContestById(contestId);

    expect(result).toMatchObject(contest);
    expect(contestRepository.findById).toBeCalledWith(contestId);
  });

  test('getContestsPaginate', async () => {
    const options: GetContestsQuery = {
      ...searchPaginationQueryBuilder(),
      author: user.username,
      sortBy: faker.random.arrayElement(['NEWEST', 'POPULAR']),
    };
    userRepository.findByUsername.mockResolvedValue(user);
    const response = await contestService.getContestsPaginate(options);

    expect(response).toMatchObject(mockContestPaginateResult);
    expect(contestRepository.paginate).toBeCalledWith(options);
  });

  test('getContestItemsPaginate', async () => {
    const options: GetItemsQuery = searchPaginationQueryBuilder();
    const response = await contestService.getContestItemsPaginate(
      contestId,
      options,
    );

    expect(response).toMatchObject(mockContestItemsPaginateResult);
    expect(contestItemRepository.paginate).toBeCalledWith(contestId, options);
  });

  test('findContestsByAuthor', async () => {
    const result = await contestService.findContestsByAuthor(user.id);

    expect(result).toMatchObject([contest]);
    expect(contestRepository.findByAuthor).toBeCalledWith(user.id);
  });

  test('createContest', async () => {
    contestRepository.createContest.mockResolvedValueOnce(contest);

    const result = await contestService.createContest(user.id, contestData);

    expect(contestRepository.createContest).toBeCalledWith({
      _id: contestId,
      author: user.id,
      title: contestData.title,
      excerpt: contestData.excerpt,
      thumbnail: `path:contests/${contestId}/thumbnail`,
    });

    expect(result).toEqual(contest);
    expect(cloudinaryService.upload).toBeCalledWith(
      'path',
      `contests/${contestId}/thumbnail`,
    );
  });

  test('updateContest', async () => {
    const result = await contestService.updateContest(contestId, contestData);

    expect(contestRepository.findByIdAndUpdate).toBeCalledWith(contestId, {
      title: contestData.title,
      excerpt: contestData.excerpt,
      thumbnail: `path:contests/${contestId}/thumbnail`,
    });

    expect(result).toEqual(contest);
    expect(cloudinaryService.upload).toBeCalledWith(
      'path',
      `contests/${contestId}/thumbnail`,
    );
  });

  test('removeContest', async () => {
    contestItemRepository.findByContestId.mockResolvedValueOnce(
      contestItems as any,
    );

    await contestService.removeContest(contestId);

    expect(contestRepository.deleteContest).toBeCalledWith(contestId);
    expect(cloudinaryService.destroy).toBeCalledWith(
      `contests/${contestId}/thumbnail`,
    );
    expect(cloudinaryService.destroyMultiple.mock.calls[0][0]).toHaveLength(
      contestItems.length,
    );
    expect(cloudinaryService.deleteFolder).toHaveBeenCalledWith(
      `contests/${contestId}`,
    );
    expect(contestItemRepository.deleteContestItems).toHaveBeenCalledWith(
      contestId,
    );
  });

  test('resetContest', async () => {
    contestRepository.findByIdAndUpdate.mockResolvedValueOnce(contest);

    const result = await contestService.resetContest(contestId);

    expect(contestRepository.findByIdAndUpdate).toHaveBeenCalledWith(
      contestId,
      { games: 0 },
    );
    expect(contestItemRepository.updateContestItems).toHaveBeenCalledWith(
      contestId,
      {
        games: 0,
        compares: 0,
        wins: 0,
        finalWins: 0,
      },
    );
    expect(gameRepository.deleteGames).toHaveBeenCalledWith(contestId);
    expect(result).toMatchObject(contest);
  });
});
