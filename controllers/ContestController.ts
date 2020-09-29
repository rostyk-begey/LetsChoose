import { Request, Response } from 'express';
import Mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import { validationResult } from 'express-validator';

import Contest from '../models/Contest';
import ContestItem from '../models/ContestItem';
import { AppError } from '../usecases/error';

const getPaginationPipelines = (page = 1, perPage = 10) => [
  {
    $skip: (page - 1) * perPage,
  },
  {
    $limit: perPage,
  },
];

const getSearchPipelines = (search = '') => {
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
};

const getCloudinaryImagePublicId = (url: string) =>
  url.split('/').slice(-1)[0].split('.')[0];

const getSortPipeline = (search: string, sortBy: string) => {
  const sortOptions = search ? { score: -1 } : {};
  if (sortBy) {
    // @ts-ignore
    sortOptions[sortBy] = -1;
  }

  return { $sort: sortOptions };
};

const getItemsSortPipeline = (search: string) => {
  const sortOptions = { rankScore: -1 };
  if (search) {
    // @ts-ignore
    sortOptions.score = -1;
  }

  return { $sort: sortOptions };
};

// @ts-ignore
const fieldNameFilter = (key: string) => ({ fieldname }): boolean =>
  fieldname === key;

const ContestController = {
  async get(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Invalid query', 400, {
        errors: errors.array(),
        message: 'Invalid query',
      });
    }

    const {
      query: { page = 1, perPage = 10, search = '', author = '', sortBy = '' },
    } = req;
    const count = await Contest.countDocuments();
    // @ts-ignore
    const totalPages = Math.ceil(count / perPage);
    if (page > totalPages) {
      throw new AppError('Invalid page number', 400);
    }
    const matchPipeline = author
      ? [{ $match: { 'author.username': author } }]
      : [];
    const contests = await Contest.aggregate([
      // @ts-ignore
      ...getSearchPipelines(search), // should be a first stage
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
      // @ts-ignore
      getSortPipeline(search, sortBy),
      // @ts-ignore
      ...getPaginationPipelines(page, perPage),
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
    res.status(200).json({
      contests,
      totalPages,
      currentPage: page,
    });
  },
  async find(req: Request, res: Response): Promise<void> {
    const {
      params: { id },
    } = req;
    const contest = await Contest.findById(id);
    if (!contest) throw new AppError('Resource not found!', 404);
    res.status(200).json(contest);
  },
  async getItems(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Invalid query', 400, {
        errors: errors.array(),
        message: 'Invalid query',
      });
    }

    const {
      params: { id },
      query: { page = 1, perPage = 10, search = '' },
    } = req;

    const contest = await Contest.findById(id);
    if (!contest) throw new AppError('Resource not found!', 404);

    const count = await ContestItem.countDocuments({ contestId: id });
    // @ts-ignore
    const totalPages = Math.ceil(count / perPage);
    if (page > totalPages) {
      throw new AppError('Invalid page number', 400);
    }
    const items = await ContestItem.aggregate([
      // @ts-ignore
      ...getSearchPipelines(search), // should be a first stage
      { $match: { contestId: id } },
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
      // @ts-ignore
      getItemsSortPipeline(search),
      // @ts-ignore
      ...getPaginationPipelines(page, perPage),
    ]).exec();
    res.status(200).json({
      items,
      totalPages,
      currentPage: page,
    });
  },
  async create(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Invalid query', 400, {
        errors: errors.array(),
      });
    }

    const {
      // @ts-ignore
      userId,
      files,
      body: { title, excerpt, items },
    } = req;
    // @ts-ignore
    const thumbnail = files.find(fieldNameFilter('thumbnail'));
    const contestId = Mongoose.Types.ObjectId();
    const { secure_url } = await cloudinary.v2.uploader.upload(thumbnail.path, {
      public_id: `contests/${contestId}/thumbnail`,
    });
    const contest = new Contest({
      _id: contestId,
      thumbnail: secure_url,
      title,
      excerpt,
      author: userId,
    });
    contest.save();
    const savingItems = items.map(
      async (item: object, i: number): Promise<void> => {
        const contestItemId = Mongoose.Types.ObjectId();
        // @ts-ignore
        const image = files.find(fieldNameFilter(`items[${i}][image]`));
        const { secure_url } = await cloudinary.v2.uploader.upload(image.path, {
          public_id: `contests/${contestId}/items/${contestItemId}`,
        });
        const contestItem = new ContestItem({
          ...item,
          image: secure_url,
          _id: contestItemId,
          contestId,
        });
        await contestItem.save();
      },
    );
    await Promise.all(savingItems);
    res.status(201).json({ message: 'Contest successfully created!' });
  },
  async update(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Invalid query', 400, {
        errors: errors.array(),
      });
    }

    const {
      files,
      params: { id: contestId },
      body: { title, excerpt },
    } = req;
    const contest = await Contest.findById(contestId);

    if (!contest) throw new AppError('Contest not found', 404);

    const data: {
      title?: string;
      excerpt?: string;
      thumbnail?: string;
    } = {};
    if (title) data.title = title;
    if (excerpt) data.excerpt = excerpt;
    if (files?.length) {
      // @ts-ignore
      const thumbnailFile = files.find(fieldNameFilter('thumbnail'));
      if (contest.thumbnail) {
        await cloudinary.v2.uploader.destroy(
          getCloudinaryImagePublicId(contest.thumbnail),
        );
      }
      const { secure_url } = await cloudinary.v2.uploader.upload(
        thumbnailFile.path,
        {
          public_id: `contests/${contestId}/thumbnail`,
        },
      );
      data.thumbnail = secure_url;
    }
    await Contest.updateOne({ _id: contestId }, data);
    res.status(200).json({ message: 'Contest successfully updated!' });
  },
  async remove(req: Request, res: Response): Promise<void> {
    const {
      params: { id },
    } = req;
    await Contest.deleteOne({ _id: id });
    await ContestItem.deleteMany({ contestId: id }); // todo: delete images
    res.status(200).json({ message: 'Contest successfully deleted!' });
  },
};

export default ContestController;
