import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import autobind from 'autobind-decorator';
import { inject, injectable } from 'inversify';

import { AppError } from '../../usecases/error';
import {
  CreateBody,
  FindParams,
  GetItemsQuery,
  GetItemsResponse,
  GetQuery,
  GetResponse,
} from './types';
import ContestService, { IContestService } from '../../services/ContestService';
import { Contest } from '../../models/Contest';
import { RequestWithUserId, ResponseMessage } from '../../types';

@autobind
@injectable()
export default class ContestController {
  private readonly contestService: IContestService;

  constructor(@inject(ContestService) contestService: IContestService) {
    this.contestService = contestService;
  }

  public async get(
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

    const response = await this.contestService.getContestsPaginate({
      page,
      perPage,
      search,
      sortBy,
      author,
    });

    res.status(200).json(response);
  }

  public async find(
    req: Request<FindParams>,
    res: Response<Contest>,
  ): Promise<void> {
    const contest = await this.contestService.findContestById(req.params.id);
    res.status(200).json(contest);
  }

  public async getItems(
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

    const response = await this.contestService.getContestItemsPaginate(id, {
      page,
      perPage,
      search,
    });

    res.status(200).json(response);
  }

  public async create(
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

    await this.contestService.createContest(userId as string, {
      title,
      excerpt,
      items,
      files: files as Express.Multer.File[],
    });

    res.status(201).json({ message: 'Contest successfully created!' });
  }

  public async update(
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

    await this.contestService.updateContest(contestId, {
      title,
      excerpt,
      files: files as Express.Multer.File[],
    });

    res.status(200).json({ message: 'Contest successfully updated!' });
  }

  public async remove(
    req: Request<FindParams>,
    res: Response<ResponseMessage>,
  ): Promise<void> {
    await this.contestService.removeContest(req.params.id);

    res.status(200).json({ message: 'Contest successfully deleted!' });
  }
}
