import { QueryKey } from 'react-query';

export type QueryKeyFactory = Readonly<
  Record<string, (...args: any[]) => QueryKey>
>;
