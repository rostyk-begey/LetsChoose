const Mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const Contest = require('../models/Contest');
const ContestItem = require('../models/ContestItem');

const SORT_OPTIONS = {
  POPULAR: 'views',
  NEWEST: '_id',
};

const getPaginationPipelines = (page = 1, perPage = 10) => [
  {
    $limit: perPage,
  },
  {
    $skip: (page - 1) * perPage,
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

const fieldNameFilter = (key) => ({ fieldname }) => fieldname === key;

const ContestController = {
  async get({ query = {} }, res) {
    try {
      let {
        page = 1,
        perPage = 10,
        search = '',
        sortBy = SORT_OPTIONS.NEWEST,
      } = query;
      page = parseInt(page, 10);
      perPage = parseInt(perPage, 10);
      if (!Object.keys(SORT_OPTIONS).includes(sortBy)) {
        sortBy = SORT_OPTIONS.POPULAR;
      }
      const count = await Contest.countDocuments();
      const totalPages = Math.ceil(count / perPage);
      if (page > totalPages) {
        // todo: validate
      }
      let contests = await Contest.aggregate([
        ...getSearchPipelines(search),
        {
          $sort: { score: -1, [SORT_OPTIONS[sortBy]]: -1 },
        },
        ...getPaginationPipelines(page, perPage),
      ]).exec();
      contests = await User.populate(contests, {
        path: 'author',
        select: { _id: 1, username: 1 },
      });
      res.status(200).json({
        contests,
        totalPages,
        currentPage: page,
      });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  },
  async find({ params: { id } }, res) {
    try {
      const contest = await Contest.findById(id);
      if (!contest) {
        return res.status(404).json({ message: 'Resource not found!' });
      }
      contest.items = await ContestItem.find({ contestId: id });
      res.status(200).json(contest);
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  },
  async create({ userId, files, body: { title, excerpt, items } }, res) {
    try {
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
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  },
  async update(
    { files, params: { id: contestId }, body: { title, excerpt } },
    res,
  ) {
    try {
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
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  },
  async remove({ params: { id } }, res) {
    try {
      await Contest.deleteOne({ _id: id });
      await ContestItem.deleteMany({ contestId: id }); // todo: delete images
      res.status(200).json({ message: 'Contest successfully deleted!' });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  },
};

module.exports = ContestController;
