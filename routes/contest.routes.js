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
const updateContestSchema = require('../middleware/contest/updateContestSchema.middleware');

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
  updateContestSchema,
  catchAsync(ContestController.update),
);

router.delete(
  '/:id',
  auth,
  catchAsync(isAuthor),
  catchAsync(ContestController.remove),
);

module.exports = router;
