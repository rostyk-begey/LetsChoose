import { ToObjectOptions } from 'mongoose';

export const getMongooseTransformOptions = <T extends { _id: string }>(
  options: ToObjectOptions = {},
): ToObjectOptions => ({
  getters: true,
  versionKey: false,
  transform: (_, { _id, ...ret }: Partial<T>) => {
    return { id: _id, ...ret };
  },
  ...options,
});
