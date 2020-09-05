const Mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const Contest = require('../models/Contest');
const ContestItem = require('../models/ContestItem');

// const rand = () => Math.random().toString(36).substr(2);

// const generateAvatar = () => {
//   const token = rand() + rand();
//   return `https://picsum.photos/seed/${token}/400`;
// };

// const CONTESTS = [...Array(10).keys()].map((i) => ({
//   id: `contest-${i}`,
//   title: `Contest ${i + 1}`,
//   authorId: i,
//   excerpt:
//     'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi impedit nobis nostrum recusandae temporibus. Amet, asperiores dolores eius incidunt nisi pariatur quas. Alias aliquam aut consequatur culpa cupiditate dignissimos dolor dolore doloremque dolorum ea eius illo, ipsa ipsum labore minima molestias, nemo, neque nihil pariatur provident quam quas quidem sint.',
//   thumbnail: generateAvatar(),
//   views: Math.floor(Math.random() * 1000),
//   likes: Math.floor(Math.random() * 1000),
//   dislikes: Math.floor(Math.random() * 1000),
//   tags: ['music', 'movie', 'image', 'art'],
// }));

// const itemsPerContest = 8;

// const ITEMS = [...Array(itemsPerContest * 10).keys()].map((i) => ({
//   id: `item-${~~(i / itemsPerContest)}${i}`,
//   contestId: `contest-${~~(i / itemsPerContest)}`,
//   title: `Item ${i + 1}`,
//   image: generateAvatar(),
//   score: 0,
//   compares: 0,
// }));

const ContestController = {
  async get({ query = {} }, res) {
    try {
      const contests = await Contest.find(query).populate(
        'author',
        'username _id',
      );
      res.status(200).json(contests);
    } catch (e) {
      res.status(500);
    }
  },
  async find({ params: { id } }, res) {
    try {
      const contest = await Contest.findById(id);
      contest.items = await ContestItem.find({ contestId: id });
      res.status(200).json(contest);
    } catch (e) {
      res.status(500);
    }
  },
  async create({ userId, files, body: { title, excerpt, items } }, res) {
    try {
      const fieldameFilter = (key) => ({ fieldname }) => fieldname === key;
      const thumbnail = files.find(fieldameFilter('thumbnail'));
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
        const image = files.find(fieldameFilter(`items[${i}][image]`));
        const { secure_url } = await cloudinary.uploader.upload(image.path, {
          public_id: `contests/${contestId}/items/${contestItemId}`,
        });
        const contestItem = new ContestItem({
          ...item,
          image: secure_url,
          _id: contestItemId,
          contestId: contestId,
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
  async update({ userId, params: { id }, body: data }, res) {
    try {
      await Contest.updateOne({ _id: id }, data);
      res.status(200).json({ message: 'Contest successfully updated!' });
    } catch (e) {
      res.status(500);
    }
  },
  async remove({ userId, params: { id } }, res) {
    try {
      await Contest.remove({ _id: id });
      await ContestItem.remove({ contestId: id });
      res.status(200).json({ message: 'Contest successfully deleted!' });
    } catch (e) {
      res.status(500);
    }
  },
};

module.exports = ContestController;
