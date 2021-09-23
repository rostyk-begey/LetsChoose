import fs from 'fs/promises';
import { fieldNameFilter, getSearchPipelines, unlinkAsync } from './utils';

describe.each`
  key        | fieldname   | expected
  ${'value'} | ${'value'}  | ${true}
  ${'value'} | ${'value1'} | ${false}
`('fieldNameFilter', ({ key, fieldname, expected }) => {
  it(`should return ${expected}`, () => {
    expect(fieldNameFilter(key)({ fieldname } as Express.Multer.File)).toBe(
      expected,
    );
  });
});

test('unlinkAsync', () => {
  const path = 'path';
  const fsUnlinkSpy = jest
    .spyOn(fs, 'unlink')
    .mockImplementation(() => undefined);

  unlinkAsync(path);

  expect(fsUnlinkSpy).toHaveBeenCalledWith(path);

  fsUnlinkSpy.mockRestore();
});

describe('getSearchPipelines', () => {
  it.each(['', '   '])(
    'should return empty array if query is empty',
    (search) => {
      expect(getSearchPipelines(search)).toHaveLength(0);
    },
  );

  it.each(['search', ' search  '])(
    'should return proper search pipelines',
    (search) => {
      expect(getSearchPipelines(search)).toMatchObject([
        {
          $search: {
            text: {
              query: 'search',
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
      ]);
    },
  );
});
