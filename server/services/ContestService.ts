import Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';

import { Contest } from '../models/Contest';
import { AppError } from '../usecases/error';
import {
  CreateBody,
  GetItemsQuery,
  GetItemsResponse,
  GetQuery,
  GetResponse,
  ISortOptions,
  SORT_OPTIONS,
} from '../controllers/contest/types';
import CloudinaryService, { ICloudinaryService } from './CloudinaryService';
import ContestRepository, {
  IContestRepository,
} from '../repositories/ContestRepository';
import ContestItemRepository, {
  IContestItemRepository,
} from '../repositories/ContestItemRepository';

interface CreateContestsData extends CreateBody {
  files: Express.Multer.File[];
}

const fieldNameFilter = (key: string) => ({ fieldname }: Express.Multer.File) =>
  fieldname === key;

export interface IContestService {
  getContestsPaginate(query: GetQuery): Promise<GetResponse>;
  findContestById(id: string): Promise<Contest>;
  getContestItemsPaginate(
    contestId: string,
    query: GetItemsQuery,
  ): Promise<GetItemsResponse>;
  createContest(userId: string, data: CreateContestsData): Promise<void>;
  updateContest(
    contestId: string,
    data: Omit<CreateContestsData, 'items'>,
  ): Promise<Contest>;
  removeContest(contestId: string): Promise<void>;
}

@injectable()
export default class ContestService implements IContestService {
  constructor(
    @inject(ContestRepository)
    protected readonly contestRepository: IContestRepository,

    @inject(ContestItemRepository)
    protected readonly contestItemRepository: IContestItemRepository,

    @inject(CloudinaryService)
    protected readonly cloudinaryService: ICloudinaryService,
  ) {}

  protected static getContestThumbnailPublicId(contestId: string): string {
    return `contests/${contestId}/thumbnail`;
  }

  protected static getPaginationPipelines(page = 1, perPage = 10): any[] {
    return [
      {
        $skip: (page - 1) * perPage,
      },
      {
        $limit: perPage,
      },
    ];
  }

  protected static getSearchPipelines(search = ''): any[] {
    const query = search.trim();
    if (!query) return [];

    return [
      {
        $search: {
          text: {
            query,
            path: ['title', 'excerpt'],
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
      {
        $addFields: {
          score: { $meta: 'searchScore' },
        },
      },
    ];
  }

  protected static getSortPipeline(
    search: string,
    sortBy: '' | keyof typeof SORT_OPTIONS,
  ): { $sort: ISortOptions } {
    const sortOptions: ISortOptions = search ? { score: -1 } : {};
    if (sortBy) {
      sortOptions[sortBy] = -1;
    }

    return { $sort: sortOptions };
  }

  protected static getItemsSortPipeline(search: string): any {
    const sortOptions = { rankScore: -1 };
    if (search) {
      // @ts-ignore
      sortOptions.score = -1;
    }

    return { $sort: sortOptions };
  }

  public async getContestsPaginate({
    page = 1,
    perPage = 10,
    search = '',
    sortBy = '',
    author = '',
  }: GetQuery): Promise<GetResponse> {
    const count = await this.contestRepository.countDocuments();
    const totalPages = Math.ceil(count / perPage);

    if (page > totalPages) {
      throw new AppError('Invalid page number', 400);
    }

    const matchPipeline = author
      ? [{ $match: { 'author.username': author } }]
      : [];

    const contests: Contest[] = await this.contestRepository.aggregate([
      ...ContestService.getSearchPipelines(search), // should be a first stage
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
      ...matchPipeline,
      ContestService.getSortPipeline(search, sortBy),
      ...ContestService.getPaginationPipelines(page, perPage),
      {
        $project: {
          _id: 1,
          id: '$_id',
          thumbnail: 1,
          title: 1,
          excerpt: 1,
          games: 1,
          createdAt: 1,
          'author.avatar': 1,
          'author.username': 1,
        },
      },
    ]);

    return {
      contests,
      currentPage: page,
      totalPages,
    };
  }

  public findContestById(id: string): Promise<Contest> {
    return this.contestRepository.findById(id);
  }

  public async getContestItemsPaginate(
    contestId: string,
    { page = 1, perPage = 10, search = '' }: GetItemsQuery,
  ): Promise<GetItemsResponse> {
    await this.findContestById(contestId);

    const count = await this.contestItemRepository.countDocuments({
      contestId,
    });

    console.log({ contestId, page, perPage, search });

    const totalPages = Math.ceil(count / perPage);

    if (page > totalPages) {
      throw new AppError('Invalid page number', 400);
    }

    const items = await this.contestItemRepository.aggregate([
      ...ContestService.getSearchPipelines(search), // should be a first stage
      { $match: { contestId: Mongoose.Types.ObjectId(contestId) } },
      {
        $project: {
          _id: 1,
          title: 1,
          image: 1,
          compares: 1,
          wins: 1,
          games: 1,
          finalWins: 1,
          winRate: {
            $cond: {
              if: { $gt: ['$compares', 0] },
              then: { $divide: ['$wins', '$compares'] },
              else: 0,
            },
          },
          finalWinRate: {
            $cond: {
              if: { $gt: ['$compares', 0] },
              then: { $divide: ['$wins', '$compares'] },
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          rankScore: {
            $add: ['$winRate', '$finalWinRate'],
          },
        },
      },
      ContestService.getItemsSortPipeline(search),
      ...ContestService.getPaginationPipelines(page, perPage),
    ]);

    return {
      items,
      totalPages,
      currentPage: page,
    };
  }

  public async createContest(
    userId: string,
    { files, title, excerpt, items }: CreateContestsData,
  ): Promise<void> {
    const thumbnail = files.find(fieldNameFilter('thumbnail'));

    const contestId = Mongoose.Types.ObjectId();

    const { secure_url } = await this.cloudinaryService.upload(
      thumbnail!.path,
      ContestService.getContestThumbnailPublicId(contestId.toString()),
    );

    await this.contestRepository.createContest({
      _id: `${contestId}`,
      thumbnail: secure_url,
      title,
      excerpt,
      author: userId,
    });

    const savingItems = items.map(
      async ({ title }, i: number): Promise<void> => {
        const contestItemId = Mongoose.Types.ObjectId();
        const image = files.find(fieldNameFilter(`items[${i}][image]`));
        const { secure_url } = await this.cloudinaryService.upload(
          image!.path,
          `contests/${contestId}/items/${contestItemId}`,
        );
        await this.contestItemRepository.createContestItem({
          title,
          image: secure_url,
          _id: `${contestItemId}`,
          contestId: `${contestId}`,
        });
      },
    );

    await Promise.all(savingItems);
  }

  public async updateContest(
    contestId: string,
    { files, title, excerpt }: Omit<CreateContestsData, 'items'>,
  ): Promise<Contest> {
    const contest: Contest = await this.findContestById(contestId);

    if (title) contest.title = title;
    if (excerpt) contest.excerpt = excerpt;
    if (files?.length) {
      const thumbnailFile = files.find(fieldNameFilter('thumbnail'));
      if (contest.thumbnail) {
        await this.cloudinaryService.destroy(
          ContestService.getContestThumbnailPublicId(contestId),
        );
      }
      const { secure_url } = await this.cloudinaryService.upload(
        thumbnailFile!.path,
        ContestService.getContestThumbnailPublicId(contestId),
      );
      contest.thumbnail = secure_url;
    }

    // @ts-ignore
    await contest.save();

    return contest;
  }

  public async removeContest(contestId: string): Promise<void> {
    await this.contestRepository.deleteContest(contestId);
    await this.contestItemRepository.deleteContestItems(contestId); // todo: delete images
  }
}
