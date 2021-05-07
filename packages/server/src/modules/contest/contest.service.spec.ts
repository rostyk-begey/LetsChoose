import { GetContestsQuery, GetItemsQuery } from '@lets-choose/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';

import gameRepository from '../game/__mocks__/game.repository';
import cloudinaryService from '../cloudinary/__mocks__/cloudinary.service';
import userRepository, { user } from '../user/__mocks__/user.repository';
import contestRepository, { contest } from './__mocks__/contest.repository';
import contestItemRepository, {
  contestItem,
} from './__mocks__/contest-item.repository';
import { TYPES } from '../../injectable.types';
import { ContestService, CreateContestsData } from './contest.service';

describe('ContestService', () => {
  let contestService: ContestService;
  const { id: contestId } = contest;
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

  beforeAll(() => {
    jest
      .spyOn(mongoose.Types, 'ObjectId')
      .mockReturnValueOnce(contestId as any);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContestService,
        {
          provide: TYPES.ContestRepository,
          useValue: contestRepository,
        },
        {
          provide: TYPES.ContestItemRepository,
          useValue: contestItemRepository,
        },
        {
          provide: TYPES.CloudinaryService,
          useValue: cloudinaryService,
        },
        {
          provide: TYPES.GameRepository,
          useValue: gameRepository,
        },
        {
          provide: TYPES.UserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    contestService = module.get<ContestService>(ContestService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('findById', async () => {
    const contest = await contestService.findContestById(contestId);

    expect(contest).toMatchObject(contest);
    expect(contestRepository.findById).toBeCalledWith(contestId);
  });

  test('getContestsPaginate', async () => {
    const options: GetContestsQuery = {
      page: 1,
      perPage: 1,
      author: 'author',
      sortBy: 'NEWEST',
      search: 'search',
    };
    const response = await contestService.getContestsPaginate(options);

    expect(response).toMatchObject({
      items: [contest],
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
    });
    expect(contestRepository.paginate).toBeCalledWith(options);
  });

  test('getContestItemsPaginate', async () => {
    const options: GetItemsQuery = {
      page: 1,
      perPage: 1,
      search: 'search',
    };
    const response = await contestService.getContestItemsPaginate(
      contestId,
      options,
    );

    expect(response).toMatchObject({
      items: [contestItem],
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
    });
    expect(contestItemRepository.paginate).toBeCalledWith(contestId, options);
  });

  test('findContestsByAuthor', async () => {
    const result = await contestService.findContestsByAuthor(user.id);

    expect(result).toMatchObject(contest);
    expect(contestRepository.findByAuthor).toBeCalledWith(user.id);
  });

  test('createContest', async () => {
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
    await contestService.removeContest(contestId);

    expect(contestRepository.deleteContest).toBeCalledWith(contestId);
    // TODO: update tests
  });

  test.todo('resetContest');
});
