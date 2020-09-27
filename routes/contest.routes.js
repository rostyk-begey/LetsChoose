const { Router } = require('express');
const Mongoose = require('mongoose');
const { param } = require('express-validator');
const multer = require('multer');
const auth = require('../middleware/auth.middleware');
const isAuthor = require('../middleware/isAuthor.middleware');
const { catchAsync } = require('../usecases/error');
const ContestController = require('../controllers/ContestController');
const getContestSchema = require('../middleware/contest/getContestSchema.middleware');
const createContestSchema = require('../middleware/contest/createContestSchema.middleware');

const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
const upload = multer({ storage, fileFilter });

const router = Router();

const rand = () => Math.random().toString(36).substr(2);

const generateAvatar = () => {
  const token = rand() + rand();
  return `https://picsum.photos/seed/${token}/400`;
};

const startedContests = [];

const CONTESTS = [...Array(10).keys()].map((i) => ({
  id: `contest-${i}`,
  title: `Contest ${i + 1}`,
  authorId: i,
  excerpt:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi impedit nobis nostrum recusandae temporibus. Amet, asperiores dolores eius incidunt nisi pariatur quas. Alias aliquam aut consequatur culpa cupiditate dignissimos dolor dolore doloremque dolorum ea eius illo, ipsa ipsum labore minima molestias, nemo, neque nihil pariatur provident quam quas quidem sint.',
  thumbnail: generateAvatar(),
  views: Math.floor(Math.random() * 1000),
  likes: Math.floor(Math.random() * 1000),
  dislikes: Math.floor(Math.random() * 1000),
  tags: ['music', 'movie', 'image', 'art'],
}));

const itemsPerContest = 8;

const ITEMS = [...Array(itemsPerContest * 10).keys()].map((i) => ({
  id: `item-${~~(i / itemsPerContest)}${i}`,
  contestId: `contest-${~~(i / itemsPerContest)}`,
  title: `Item ${i + 1}`,
  image: generateAvatar(),
  score: 0,
  compares: 0,
}));

router.get('/', getContestSchema, catchAsync(ContestController.get));

router.post(
  '/',
  upload.any(),
  auth,
  createContestSchema,
  catchAsync(ContestController.create),
);

router.get(
  '/:id',
  param('id').customSanitizer((value) => Mongoose.Types.ObjectId(value)),
  catchAsync(ContestController.find),
);

router.post(
  '/:id',
  upload.any(),
  auth,
  catchAsync(isAuthor),
  catchAsync(ContestController.update),
);

router.delete(
  '/:id',
  auth,
  catchAsync(isAuthor),
  catchAsync(ContestController.remove),
);

router.get(
  '/started',
  async ({ userId = 'user-0', params: { id }, body: winnerId = null }, res) => {
    res.status(200).json(startedContests);
  },
);
//
router.post(
  '/:id/start',
  async ({ userId = 'user-0', params: { id } }, res) => {
    try {
      const items = ITEMS.filter(({ contestId }) => contestId === id).map(
        ({ id }) => id,
      );
      const newContestItems = Array(Math.log2(8)).fill([]);
      newContestItems[0] = items;
      const newContest = {
        userId,
        contestId: id,
        roundIndex: 0,
        pairIndex: 0,
        items: newContestItems,
      };
      const existingContestIndex = startedContests.findIndex(
        ({ userId: uId, contestId: cId }) => uId === userId && cId === id,
      );
      if (existingContestIndex !== -1) {
        startedContests[existingContestIndex] = newContest;
      } else {
        startedContests.push(newContest);
      }

      res.status(201).json({
        gameState: {
          contestId: id,
          roundIndex: 0,
          pairIndex: 0,
          pair: items.slice(0, 2),
        },
      });
    } catch (e) {
      console.error(e);
    }
  },
);
//
router.post(
  '/:id/play',
  async ({ userId = 'user-0', params: { id }, body: { winnerId } }, res) => {
    try {
      const startedContestIndex = startedContests.findIndex(
        ({ userId: uId, contestId: cId }) => uId === userId && cId === id,
      );
      let { roundIndex, pairIndex, items, ...startedContest } = startedContests[
        startedContestIndex
      ];
      pairIndex += 2;
      if (roundIndex < items.length) {
        items[roundIndex + 1] = [...items[roundIndex + 1], winnerId];
      } else {
        // todo: finish contest
      }
      if (pairIndex === items[roundIndex].length) {
        roundIndex += 1;
        pairIndex = 0;
      }

      // console.log(items);
      const pair = items[roundIndex].slice(pairIndex, pairIndex + 2);

      startedContests[startedContestIndex] = {
        ...startedContest,
        roundIndex,
        pairIndex,
        items,
      };
      res.status(200).json({
        gameState: {
          roundIndex,
          pairIndex,
          pair,
          items,
        },
      });
    } catch (e) {
      console.error(e);
    }
  },
);

module.exports = router;
