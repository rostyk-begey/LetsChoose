import * as fs from 'fs';
import { promisify } from 'util';

export const fieldNameFilter = (key: string) => ({
  fieldname,
}: Express.Multer.File) => {
  return fieldname === key;
};

export const unlinkAsync = promisify(fs.unlink);
