import Mongoose from 'mongoose';

import { Contest, ContestModel } from '../models/Contest';
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
import { ContestItemModel } from '../models/ContestItem';
import CloudinaryService from './CloudinaryService';

interface CreateContestsData extends CreateBody {
  files: Express.Multer.File[];
}

const getCloudinaryImagePublicId = (url: string) =>
  url.split('/').slice(-1)[0].split('.')[0];

const fieldNameFilter = (key: string) => ({ fieldname }: Express.Multer.File) =>
  fieldname === key;

export default class ContestService {
  private static getContestThumbnailPublicId(contestId: string) {
    return `contests/${contestId}/thumbnail`;
  }

  private static getPaginationPipelines(page = 1, perPage = 10) {
    return [
      {
        $skip: (page - 1) * perPage,
      },
      {
        $limit: perPage,
      },
    ];
  }

  private static getSearchPipelines(search = '') {
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

  private static getSortPipeline(
    search: string,
    sortBy: '' | keyof typeof SORT_OPTIONS,
  ): { $sort: ISortOptions } {
    const sortOptions: ISortOptions = search ? { score: -1 } : {};
    if (sortBy) {
      sortOptions[sortBy] = -1;
    }

    return { $sort: sortOptions };
  }

  private static getItemsSortPipeline(search: string) {
    const sortOptions = { rankScore: -1 };
    if (search) {
      // @ts-ignore
      sortOptions.score = -1;
    }

    return { $sort: sortOptions };
  }

  public static async getContestsPaginate({
    page = 1,
    perPage = 10,
    search = '',
    sortBy = '',
    author = '',
  }: GetQuery): Promise<GetResponse> {
    const count = await ContestModel.countDocuments();
    const totalPages = Math.ceil(count / perPage);

    if (page > totalPages) {
      throw new AppError('Invalid page number', 400);
    }

    const matchPipeline = author
      ? [{ $match: { 'author.username': author } }]
      : [];

    const contests: Contest[] = await ContestModel.aggregate([
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
          thumbnail: 1,
          title: 1,
          excerpt: 1,
          games: 1,
          createdAt: 1,
          'author.avatar': 1,
          'author.username': 1,
        },
      },
    ]).exec();

    return {
      contests,
      currentPage: page,
      totalPages,
    };
  }

  public static async findContestById(id: string): Promise<Contest> {
    const contest = await ContestModel.findById(id);

    if (!contest) {
      throw new AppError('Resource not found!', 404);
    }

    return contest;
  }

  public static async getContestItemsPaginate(
    contestId: string,
    { page = 1, perPage = 10, search = '' }: GetItemsQuery,
  ): Promise<GetItemsResponse> {
    await ContestService.findContestById(contestId);

    const count = await ContestItemModel.countDocuments({ contestId });

    const totalPages = Math.ceil(count / perPage);

    if (page > totalPages) {
      throw new AppError('Invalid page number', 400);
    }

    const items = await ContestItemModel.aggregate([
      ...ContestService.getSearchPipelines(search), // should be a first stage
      { $match: { contestId } },
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
    ]).exec();

    return {
      items,
      totalPages,
      currentPage: page,
    };
  }

  public static async createContest(
    userId: string,
    { files, title, excerpt, items }: CreateContestsData,
  ): Promise<void> {
    const thumbnail = files.find(fieldNameFilter('thumbnail'));

    const contestId = Mongoose.Types.ObjectId();

    const { secure_url } = await CloudinaryService.upload(
      thumbnail!.path,
      ContestService.getContestThumbnailPublicId(contestId.toString()),
    );

    const contest = new ContestModel({
      _id: contestId,
      thumbnail: secure_url,
      title,
      excerpt,
      author: userId,
    });

    await contest.save();

    const savingItems = items.map(
      async (item, i: number): Promise<void> => {
        const contestItemId = Mongoose.Types.ObjectId();
        const image = files.find(fieldNameFilter(`items[${i}][image]`));
        const { secure_url } = await CloudinaryService.upload(
          image!.path,
          `contests/${contestId}/items/${contestItemId}`,
        );
        const contestItem = new ContestItemModel({
          ...item,
          image: secure_url,
          _id: contestItemId,
          contestId,
        });
        await contestItem.save();
      },
    );

    await Promise.all(savingItems);
  }

  public static async updateContest(
    contestId: string,
    { files, title, excerpt }: Omit<CreateContestsData, 'items'>,
  ): Promise<Contest> {
    const contest: Contest = await ContestService.findContestById(contestId);

    if (title) contest.title = title;
    if (excerpt) contest.excerpt = excerpt;
    if (files?.length) {
      const thumbnailFile = files.find(fieldNameFilter('thumbnail'));
      if (contest.thumbnail) {
        await CloudinaryService.destroy(
          getCloudinaryImagePublicId(contest.thumbnail),
        );
      }
      const { secure_url } = await CloudinaryService.upload(
        thumbnailFile!.path,
        ContestService.getContestThumbnailPublicId(contestId),
      );
      contest.thumbnail = secure_url;
    }

    // @ts-ignore
    await contest.save();

    return contest;
  }

  public static async removeContest(contestId: string): Promise<void> {
    await ContestModel.findByIdAndDelete(contestId);
    await ContestItemModel.deleteMany({ contestId }); // todo: delete images
  }
}
