import { Router, Request } from 'express';
import Mongoose from 'mongoose';
import { param } from 'express-validator';
import multer, { FileFilterCallback } from 'multer';

import auth from '../middleware/auth.middleware';
import isAuthor from '../middleware/isAuthor.middleware';
import { catchAsync } from '../usecases/error';
import ContestController from '../controllers/contest/ContestController';
import {
  getContestSchema,
  getContestItemsSchema,
  createContestSchema,
  updateContestSchema,
} from '../schema/contest';

const storage = multer.diskStorage({
  filename: (
    req: Request,
    file: { originalname: string },
    callback: (error: Error | null, filename: string) => void,
  ): void => {
    callback(null, Date.now() + file.originalname);
  },
});
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'));
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

router.get(
  '/:id/items',
  getContestItemsSchema,
  catchAsync(ContestController.getItems),
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

export default router;