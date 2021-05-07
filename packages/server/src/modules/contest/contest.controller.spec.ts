import {
  GetContestsQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  UpdateContestData,
} from '@lets-choose/common';
import { Test, TestingModule } from '@nestjs/testing';

import { IContestService } from '../../abstract/contest.service.interface';
import contestItemRepository from '../contest/__mocks__/contest-item.repository';
import contestRepository, {
  contest,
} from '../contest/__mocks__/contest.repository';
import gameRepository from '../game/__mocks__/game.repository';
import userRepository from '../user/__mocks__/user.repository';
import cloudinaryService from '../cloudinary/__mocks__/cloudinary.service';
import { TYPES } from '../../injectable.types';
import { ContestController } from './contest.controller';
import { ContestService, CreateContestsData } from './contest.service';

jest.mock('../../usecases/utils', () => ({
  fieldNameFilter: jest.fn(() => () => true),
  unlinkAsync: jest.fn(() => Promise.resolve()),
}));

jest.unmock('../../usecases/object-id.schema.ts');

const files = [
  { fieldname: 'thumbnail', path: 'path' },
  { fieldname: 'items[0][image]', path: 'item[0][image]' },
  { fieldname: 'items[1][image]', path: 'item[1][image]' },
];

describe('ContestController', () => {
  let controller: ContestController;
  let contestService: IContestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContestController],
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

    contestService = module.get<IContestService>(TYPES.ContestService);
    controller = module.get<ContestController>(ContestController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('get', async () => {
    const query: GetContestsQuery = {
      author: '',
      sortBy: '',
      search: '',
      page: 1,
      perPage: 10,
    };
    const result: GetContestsResponse = {
      items: [],
      currentPage: 1,
      totalPages: 10,
      totalItems: 1,
    };
    jest
      .spyOn(contestService, 'getContestsPaginate')
      .mockImplementation(() => Promise.resolve(result));
    const response = await controller.get(query);

    expect(response).toMatchObject(result);
  });

  test('find', async () => {
    jest
      .spyOn(contestService, 'findContestById')
      .mockImplementation(() => Promise.resolve(contest));
    const response = await controller.find(contest.id);

    expect(response).toMatchObject(contest);
  });

  test('getItems', async () => {
    const query: GetItemsQuery = {
      search: '',
      page: 1,
      perPage: 10,
    };
    const result: GetItemsResponse = {
      items: [],
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
    };
    jest
      .spyOn(contestService, 'getContestItemsPaginate')
      .mockImplementation(() => Promise.resolve(result));
    const response = await controller.getItems(contest.id, query);

    expect(response).toMatchObject(result);
  });

  test('create', async () => {
    const testUserId = 'testUserId';
    const contestData = {
      title: 'testContestTitle',
      excerpt: 'testContestExcerpt',
      items: [{ title: 'item0' }, { title: 'item1' }],
    } as CreateContestsData;

    jest
      .spyOn(contestService, 'createContest')
      .mockImplementation(() => Promise.resolve(contest));
    const response = await controller.create(contestData, files, {
      user: { id: testUserId },
    });

    expect(response).toMatchObject(contest);
    expect(contestService.createContest).toBeCalledWith(testUserId, {
      ...contestData,
      files,
    });
  });

  test('update', async () => {
    const contestId = 'testContestId';
    const contestData: UpdateContestData = {
      title: 'testContestTitle',
      excerpt: 'testContestExcerpt',
    };

    jest
      .spyOn(contestService, 'updateContest')
      .mockImplementation(() => Promise.resolve(contest));
    const response = await controller.update(contestId, contestData, files);

    expect(response).toMatchObject({
      message: 'Contest successfully updated!',
    });

    expect(contestService.updateContest).toBeCalledWith(contestId, {
      title: contestData.title,
      excerpt: contestData.excerpt,
      files,
    });
  });

  test('reset', async () => {
    const contestId = contest.id;

    jest
      .spyOn(contestService, 'findContestById')
      .mockImplementation(() => Promise.resolve(contest));

    jest
      .spyOn(contestService, 'resetContest')
      .mockImplementation(() => Promise.resolve(contest));
    const response = await controller.reset(contestId, {
      user: { id: contest.author },
    });

    expect(response).toMatchObject(contest);

    expect(contestService.findContestById).toBeCalledWith(contestId);
    expect(contestService.resetContest).toBeCalledWith(contestId);
  });

  test('remove', async () => {
    const contestId = contest.id;

    jest
      .spyOn(contestService, 'findContestById')
      .mockImplementation(() => Promise.resolve(contest));

    jest
      .spyOn(contestService, 'removeContest')
      .mockImplementation(() => Promise.resolve());
    const response = await controller.remove(contestId, {
      user: { id: contest.author },
    });

    expect(response).toMatchObject({
      message: 'Contest successfully deleted!',
    });

    expect(contestService.findContestById).toBeCalledWith(contestId);
    expect(contestService.removeContest).toBeCalledWith(contestId);
  });
});
