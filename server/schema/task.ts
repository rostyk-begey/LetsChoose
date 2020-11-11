import { checkSchema } from 'express-validator';

export const newTaskSchema = checkSchema({
  title: {
    in: 'body',
    isString: true,
  },
  secret: {
    in: 'body',
    isString: true,
  },
  hardness: {
    in: 'body',
    isNumeric: true,
    toInt: true,
  },
});
