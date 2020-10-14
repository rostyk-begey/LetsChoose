import { validationResult } from 'express-validator';

import { AppError } from '../../usecases/error';
import {
  CreateBody,
  FindParams,
  GetItemsQuery,
  GetItemsResponse,
  GetQuery,
  GetResponse,
} from './types';
import ContestService from '../../services/ContestService';
import { Request, Response } from 'express';
import { Contest } from '../../models/Contest';
import { RequestWithUserId, ResponseMessage } from '../../types';

export default class ContestController {
  public static async get(
    req: Request<never, any, any, GetQuery>,
    res: Response<GetResponse>,
  ): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Invalid query', 400, {
        errors: errors.array(),
        message: 'Invalid query',
      });
    }

    const {
      query: { page, perPage, search, author, sortBy },
    } = req;

    const response = await ContestService.getContestsPaginate({
      page,
      perPage,
      search,
      sortBy,
      author,
    });

    res.status(200).json(response);
  }

  public static async find(
    req: Request<FindParams>,
    res: Response<Contest>,
  ): Promise<void> {
    const contest = await ContestService.findContestById(req.params.id);
    res.status(200).json(contest);
  }

  public static async getItems(
    req: Request<FindParams, any, any, GetItemsQuery>,
    res: Response<GetItemsResponse>,
  ): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Invalid query', 400, {
        errors: errors.array(),
        message: 'Invalid query',
      });
    }

    const {
      params: { id },
      query: { page, perPage, search },
    } = req;

    const response = await ContestService.getContestItemsPaginate(id, {
      page,
      perPage,
      search,
    });

    res.status(200).json(response);
  }

  public static async create(
    req: RequestWithUserId<never, any, CreateBody>,
    res: Response<ResponseMessage>,
  ): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Invalid query', 400, {
        errors: errors.array(),
      });
    }

    const {
      userId,
      files,
      body: { title, excerpt, items },
    } = req;

    await ContestService.createContest(userId as string, {
      title,
      excerpt,
      items,
      files: files as Express.Multer.File[],
    });

    res.status(201).json({ message: 'Contest successfully created!' });
  }

  public static async update(
    req: Request<FindParams, any, Omit<CreateBody, 'items'>>,
    res: Response,
  ): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Invalid query', 400, {
        errors: errors.array(),
      });
    }

    const {
      files,
      params: { id: contestId },
      body: { title, excerpt },
    } = req;

    await ContestService.updateContest(contestId, {
      title,
      excerpt,
      files: files as Express.Multer.File[],
    });

    res.status(200).json({ message: 'Contest successfully updated!' });
  }

  public static async remove(
    req: Request<FindParams>,
    res: Response<ResponseMessage>,
  ): Promise<void> {
    await ContestService.removeContest(req.params.id);

    res.status(200).json({ message: 'Contest successfully deleted!' });
  }
}
