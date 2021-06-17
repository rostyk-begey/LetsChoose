import { CustomValidator } from 'joi';
import mongoose from 'mongoose';
import { PathLike } from 'fs';
import fs from 'fs/promises';

export const fieldNameFilter =
  (key: string) =>
  ({ fieldname }: Express.Multer.File) => {
    return fieldname === key;
  };

export const unlinkAsync = (path: PathLike) => fs.unlink(path);

export const getSearchPipelines = (search = ''): any[] => {
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

export const getPaginationPipelines = (page = 1, perPage = 10): any[] => [
  {
    $facet: {
      metadata: [
        {
          $count: 'total',
        },
      ],
      items: [
        {
          $skip: (page > 0 ? page - 1 : 0) * perPage,
        },
        {
          $limit: perPage,
        },
      ],
    },
  },
  {
    $project: {
      items: 1,
      // Get total from the first element of the metadata array
      totalItems: { $arrayElemAt: ['$metadata.total', 0] },
      totalPages: {
        $ceil: {
          $divide: [{ $arrayElemAt: ['$metadata.total', 0] }, perPage],
        },
      },
    },
  },
  {
    $addFields: {
      currentPage: page,
    },
  },
];

export const joiObjectIdValidator: CustomValidator = (value, helpers) => {
  // for example if the username value is (something) then it will throw an error with flowing message but it throws an error inside (value) object without error message. It should throw error inside the (error) object with a proper error message

  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('objectId.invalid');
  }

  // Return the value unchanged
  return mongoose.Types.ObjectId(value);
};
