import { checkSchema } from 'express-validator';
import { isArray } from 'lodash';
import Mongoose from 'mongoose';
import { SORT_OPTIONS } from '../controllers/contest/types';

export const getContestSchema = checkSchema({
  page: {
    in: 'query',
    toInt: true,
    customSanitizer: {
      options: (value) => value || 1,
    },
  },
  perPage: {
    in: 'query',
    toInt: true,
    customSanitizer: {
      options: (value) => value || 10,
    },
  },
  search: {
    in: 'query',
    trim: true,
  },
  author: {
    in: 'query',
    trim: true,
  },
  sortBy: {
    in: 'query',
    customSanitizer: {
      options: (value: keyof typeof SORT_OPTIONS): SORT_OPTIONS => SORT_OPTIONS[value] || SORT_OPTIONS.NEWEST,
    },
  },
});

export const createContestSchema = checkSchema({
  title: {
    in: 'body',
    exists: {
      errorMessage: 'Title is missing',
    },
    isLength: {
      errorMessage: 'Title should have at least 5 characters',
      // @ts-ignore
      min: 5,
      max: 255,
    },
  },
  excerpt: {
    in: 'body',
    isLength: {
      errorMessage: 'Excerpt is too large',
      // @ts-ignore
      max: 255,
    },
  },
  items: {
    in: 'body',
    custom: {
      options: (value) => {
        if (isArray(value) && value.length >= 2) return true;
        throw new Error('Contest should have at least 2 items');
      },
    },
  },
});

export const updateContestSchema = checkSchema({
  title: {
    in: 'body',
    isLength: {
      errorMessage: 'Title should have at least 5 characters',
      // @ts-ignore
      min: 5,
      max: 255,
    },
  },
  excerpt: {
    in: 'body',
    isLength: {
      errorMessage: 'Excerpt is too large',
      // @ts-ignore
      max: 255,
    },
  },
});

export const getContestItemsSchema = checkSchema({
  id: {
    in: 'params',
    customSanitizer: {
      options: (value) => Mongoose.Types.ObjectId(value),
    },
  },
  page: {
    in: 'query',
    toInt: true,
    customSanitizer: {
      options: (value) => value || 1,
    },
  },
  perPage: {
    in: 'query',
    toInt: true,
    customSanitizer: {
      options: (value) => value || 10,
    },
  },
  search: {
    in: 'query',
    trim: true,
  },
});
