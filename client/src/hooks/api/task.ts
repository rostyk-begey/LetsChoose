import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  MutationResultPair,
  InfiniteQueryResult,
  QueryOptions,
} from 'react-query';
import { AxiosResponse } from 'axios';

import api from '../../providers/apiProvider';
import ROUTES from '../../utils/routes';
import {
  GetQuery,
  GetItemsQuery,
  GetResponse,
  GetItemsResponse,
  CreateBody,
} from '../../../../server/controllers/contest/types';
import { ResponseMessage } from '../../../../server/types';
import { Contest } from '../../../../server/models/Contest';
import { Task } from '../../../../server/models/Task';

export const useTasksApi = () => {
  const baseURL = ROUTES.API.TASKS;
  const all = () => api.get<Task[]>(baseURL);
  const create = (data: any) => api.post<ResponseMessage>(baseURL, data);
  const remove = (id: string) => api.delete(`${baseURL}/${id}`);
  return { all, create, remove };
};

export const useTasksAll = (config: QueryOptions<any, any> = {}) => {
  const { all } = useTasksApi();
  return useQuery<AxiosResponse<Task[]>, string>('tasks', all, config);
};

export const useTaskCreate = (): MutationResultPair<
  AxiosResponse<ResponseMessage>,
  any,
  Error
> => {
  const { create } = useTasksApi();
  return useMutation(create);
};

export const useTaskRemove = (): MutationResultPair<
  AxiosResponse<ResponseMessage>,
  any,
  Error
> => {
  const { remove } = useTasksApi();
  return useMutation(remove);
};
