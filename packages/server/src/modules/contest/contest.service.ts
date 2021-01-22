import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import * as mongoose from 'mongoose';

import {
  Contest,
  CreateContestDTO,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  GetContestQuery,
  ISortOptions,
  SORT_OPTIONS,
} from '@lets-choose/common';
import { ICloudinaryService } from '../../abstract/cloudinary.service.interface';
import { IContestItemRepository } from '../../abstract/contest-item.repository.interface';
import { TYPES } from '../../injectable.types';
import { IContestService } from '../../abstract/contest.service.interface';
import { IContestRepository } from '../../abstract/contest.repository.interface';

interface SortOptions {
  rankScore: number;
  score?: number;
}

interface SortPipeline {
  $sort: ISortOptions;
}

interface CreateContestsData extends CreateContestDTO {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  files: Express.Multer.File[];
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const fieldNameFilter = (key: string) => ({ fieldname }: Express.Multer.File) =>
  fieldname === key;

@Injectable()
export class ContestService implements IContestService {
  constructor(
    @Inject(TYPES.ContestRepository)
    protected readonly contestRepository: IContestRepository,

    @Inject(TYPES.ContestItemRepository)
    protected readonly contestItemRepository: IContestItemRepository,

    @Inject(TYPES.CloudinaryService)
    protected readonly cloudinaryService: ICloudinaryService,
  ) {}

  protected static getContestThumbnailPublicId(contestId: string): string {
    return `contests/${contestId}/thumbnail`;
  }

  protected static getPaginationPipelines(page = 1, perPage = 10): any[] {
    return [
      {
        $skip: (+page - 1) * perPage,
      },
      {
        $limit: +perPage,
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
    sortBy: string | keyof typeof SORT_OPTIONS = SORT_OPTIONS.POPULAR,
  ): { $sort: ISortOptions } {
    const sortOptions: ISortOptions = search ? { score: -1 } : {};
    if (sortBy) {
      sortOptions[sortBy] = -1;
    }

    return { $sort: sortOptions };
  }

  protected static getItemsSortPipeline(search: string): SortPipeline {
    const sortOptions: SortOptions = { rankScore: -1 };
    if (search) {
      sortOptions.score = -1;
    }

    return { $sort: sortOptions };
  }

  public async getContestsPaginate({
    page = 1,
    perPage = 10,
    search = '',
    sortBy = 'POPULAR',
    author = '',
  }: GetContestQuery): Promise<GetContestsResponse> {
    const count = await this.contestRepository.countDocuments();
    const totalPages = Math.ceil(count / perPage);

    if (+page > totalPages) {
      throw new BadRequestException('Invalid page number');
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
      ContestService.getSortPipeline(search, SORT_OPTIONS[sortBy]),
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
      currentPage: +page,
      totalPages,
    };
  }

  public findContestById(id: string): Promise<Contest> {
    return this.contestRepository.findById(id);
  }

  public findContestsByAuthor(author: string): Promise<Contest[]> {
    return this.contestRepository.findByAuthor(author);
  }

  public async getContestItemsPaginate(
    contestId: string,
    { page = 1, perPage = 10, search = '' }: GetItemsQuery,
  ): Promise<GetItemsResponse> {
    await this.findContestById(contestId);

    const count = await this.contestItemRepository.countDocuments({
      contestId,
    });

    const totalPages = Math.ceil(count / perPage);

    if (+page > totalPages) {
      throw new BadRequestException('Invalid page number');
    }

    const items = await this.contestItemRepository.aggregate([
      ...ContestService.getSearchPipelines(search), // should be a first stage
      { $match: { contestId: mongoose.Types.ObjectId(contestId) } },
      {
        $project: {
          _id: 1,
          id: '$_id',
          title: 1,
          image: 1,
          compares: 1,
          contestId: 1,
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

    const contestId = mongoose.Types.ObjectId();

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
        const contestItemId = mongoose.Types.ObjectId();
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
    const data: Partial<Contest> = {};

    if (title) {
      data.title = title;
    }

    if (excerpt) {
      data.excerpt = excerpt;
    }

    if (files?.length) {
      const thumbnailFile = files.find(fieldNameFilter('thumbnail'));
      if (data.thumbnail) {
        await this.cloudinaryService.destroy(
          ContestService.getContestThumbnailPublicId(contestId),
        );
      }
      const { secure_url } = await this.cloudinaryService.upload(
        thumbnailFile!.path,
        ContestService.getContestThumbnailPublicId(contestId),
      );
      data.thumbnail = secure_url;
    }

    return this.contestRepository.findByIdAndUpdate(contestId, data);
  }

  public async removeContest(contestId: string): Promise<void> {
    await this.contestRepository.deleteContest(contestId);
    // todo: delete images
    await this.contestItemRepository.deleteContestItems(contestId);
  }
}
