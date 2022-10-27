import { QueryKey } from '@tanstack/react-query';

export type QueryKeyFactory = Readonly<
  Record<string, (...args: any[]) => QueryKey>
>;
