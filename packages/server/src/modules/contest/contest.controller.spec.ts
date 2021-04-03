import {
  GetContestQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  UpdateContestData,
} from '@lets-choose/common';
import { Test, TestingModule } from '@nestjs/testing';
import MockContestItemRepository from '../../../test/mocks/repositories/contest-item.repository';
import MockContestRepository, {
  mockContests,
} from '../../../test/mocks/repositories/contest.repository';
import MockGameRepository from '../../../test/mocks/repositories/game.repository';
import MockUserRepository from '../../../test/mocks/repositories/user.repository';
import MockCloudinaryService from '../../../test/mocks/services/cloudinary.service';
import { TYPES } from '../../injectable.types';
import { ContestController } from './contest.controller';
import { ContestService, CreateContestsData } from './contest.service';

jest.mock('../../usecases/utils', () => ({
  fieldNameFilter: jest.fn(() => () => true),
  unlinkAsync: jest.fn(() => Promise.resolve()),
}));

const files = [
  { fieldname: 'thumbnail', path: 'path' },
  { fieldname: 'items[0][image]', path: 'item[0][image]' },
  { fieldname: 'items[1][image]', path: 'item[1][image]' },
];

describe('ContestController', () => {
  let controller: ContestController;
  let contestService: ContestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContestController],
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
    controller = module.get<ContestController>(ContestController);
  });

  test('get', async () => {
    const query: GetContestQuery = {
      author: '',
      sortBy: '',
      search: '',
      page: 1,
      perPage: 10,
    };
    const result: GetContestsResponse = {
      contests: [],
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
      .mockImplementation(() => Promise.resolve(mockContests[0]));
    const response = await controller.find(mockContests[0].id);

    expect(response).toMatchObject(mockContests[0]);
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
    const response = await controller.getItems(mockContests[0].id, query);

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
      .mockImplementation(() => Promise.resolve(mockContests[0]));
    const response = await controller.create(contestData, files, {
      user: { id: testUserId },
    });

    expect(response).toMatchObject(mockContests[0]);
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
      .mockImplementation(() => Promise.resolve(mockContests[0]));
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
    const contestId = mockContests[0].id;

    jest
      .spyOn(contestService, 'findContestById')
      .mockImplementation(() => Promise.resolve(mockContests[0]));

    jest
      .spyOn(contestService, 'resetContest')
      .mockImplementation(() => Promise.resolve(mockContests[0]));
    const response = await controller.reset(contestId, {
      user: { id: mockContests[0].author },
    });

    expect(response).toMatchObject(mockContests[0]);

    expect(contestService.findContestById).toBeCalledWith(contestId);
    expect(contestService.resetContest).toBeCalledWith(contestId);
  });

  test('remove', async () => {
    const contestId = mockContests[0].id;

    jest
      .spyOn(contestService, 'findContestById')
      .mockImplementation(() => Promise.resolve(mockContests[0]));

    jest
      .spyOn(contestService, 'removeContest')
      .mockImplementation(() => Promise.resolve());
    const response = await controller.remove(contestId, {
      user: { id: mockContests[0].author },
    });

    expect(response).toMatchObject({
      message: 'Contest successfully deleted!',
    });

    expect(contestService.findContestById).toBeCalledWith(contestId);
    expect(contestService.removeContest).toBeCalledWith(contestId);
  });
});
