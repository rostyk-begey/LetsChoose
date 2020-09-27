const Mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { validationResult } = require('express-validator');
const Contest = require('../models/Contest');
const ContestItem = require('../models/ContestItem');
const { AppError } = require('../usecases/error');

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

const getCloudinaryImagePublicId = (url) =>
  url.split('/').slice(-1)[0].split('.')[0];

const getSortPipeline = (search, sortBy) => {
  const sortOptions = search ? { score: -1 } : {};
  if (sortBy) sortOptions[sortBy] = -1;

  return { $sort: sortOptions };
};

const fieldNameFilter = (key) => ({ fieldname }) => fieldname === key;

const ContestController = {
  async get(req, res) {
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
    const totalPages = Math.ceil(count / perPage);
    if (page > totalPages) {
      throw new AppError('Invalid page number', 403);
    }
    const matchPipeline = author
      ? [{ $match: { 'author.username': author } }]
      : [];
    const contests = await Contest.aggregate([
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
      getSortPipeline(search, sortBy),
      ...getPaginationPipelines(page, perPage),
    ]).exec();
    res.status(200).json({
      contests,
      totalPages,
      currentPage: page,
    });
  },
  async find({ params: { id } }, res) {
    const contest = await Contest.findById(id);
    if (!contest) {
      return new AppError('Resource not found!', 404);
    }
    contest.items = await ContestItem.find({ contestId: id });
    res.status(200).json(contest);
  },
  async create(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Invalid query', 400, {
        errors: errors.array(),
      });
    }

    const {
      userId,
      files,
      body: { title, excerpt, items },
    } = req;
    const thumbnail = files.find(fieldNameFilter('thumbnail'));
    const contestId = Mongoose.Types.ObjectId();
    const { secure_url } = await cloudinary.uploader.upload(thumbnail.path, {
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
    const savingItems = items.map(async (item, i) => {
      const contestItemId = Mongoose.Types.ObjectId();
      const image = files.find(fieldNameFilter(`items[${i}][image]`));
      const { secure_url } = await cloudinary.uploader.upload(image.path, {
        public_id: `contests/${contestId}/items/${contestItemId}`,
      });
      const contestItem = new ContestItem({
        ...item,
        image: secure_url,
        _id: contestItemId,
        contestId,
      });
      await contestItem.save();
    });
    await Promise.all(savingItems);
    res.status(201).json({ message: 'Contest successfully created!' });
  },
  async update(req, res) {
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
    const data = {};
    if (title) data.title = title;
    if (excerpt) data.excerpt = excerpt;
    if (files?.length) {
      const thumbnailFile = files.find(fieldNameFilter('thumbnail'));
      if (contest.thumbnail) {
        await cloudinary.uploader.destroy(
          getCloudinaryImagePublicId(contest.thumbnail),
        );
      }
      const { secure_url } = await cloudinary.uploader.upload(
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
  async remove({ params: { id } }, res) {
    await Contest.deleteOne({ _id: id });
    await ContestItem.deleteMany({ contestId: id }); // todo: delete images
    res.status(200).json({ message: 'Contest successfully deleted!' });
  },
};

module.exports = ContestController;
