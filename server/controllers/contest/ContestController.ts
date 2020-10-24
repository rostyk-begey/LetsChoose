import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  requestParam,
  results,
} from 'inversify-express-utils';
import { inject } from 'inversify';

import { AppError } from '../../usecases/error';
import { CreateBody, FindParams, GetItemsQuery, GetQuery } from './types';
import { IContestService } from '../../services/ContestService';
import { RequestWithUserId, ResponseMessage } from '../../types';
import {
  createContestSchema,
  getContestItemsSchema,
  getContestSchema,
  updateContestSchema,
} from '../../schema/contest';
import IsAuthorMiddleware from '../../middleware/IsAuthorMiddleware';
import AuthMiddleware from '../../middleware/AuthMiddleware';
import { TYPES } from '../../inversify.types';

@controller('/api/contests')
export default class ContestController extends BaseHttpController {
  constructor(
    @inject(TYPES.ContestService)
    private readonly contestService: IContestService,
  ) {
    super();
  }

  @httpGet('/', ...getContestSchema)
  public async get(
    req: Request<never, any, any, GetQuery>,
  ): Promise<results.JsonResult> {
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

    return this.json(response, 200);
  }

  @httpGet('/:contestId')
  public async find(
    @requestParam('contestId') contestId: string,
  ): Promise<results.JsonResult> {
    const contest = await this.contestService.findContestById(contestId);
    return this.json(contest, 200);
  }

  @httpGet('/:id/items', ...getContestItemsSchema)
  public async getItems(
    req: Request<FindParams, any, any, GetItemsQuery>,
  ): Promise<results.JsonResult> {
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

    return this.json(response, 200);
  }

  @httpPost('/', TYPES.AuthMiddleware, ...createContestSchema)
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
      // @ts-ignore
      files,
      body: { title, excerpt, items },
    } = req;

    await this.contestService.createContest(userId as string, {
      title,
      excerpt,
      items,
      files,
    });

    res.status(201).json({ message: 'Contest successfully created!' });
  }

  @httpPost('/:id', TYPES.AuthMiddleware, ...updateContestSchema)
  public async update(
    req: Request<FindParams, any, Omit<CreateBody, 'items'>>,
  ): Promise<results.JsonResult> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Invalid query', 400, {
        errors: errors.array(),
      });
    }

    const {
      // @ts-ignore
      files,
      params: { id: contestId },
      body: { title, excerpt },
    } = req;

    await this.contestService.updateContest(contestId, {
      title,
      excerpt,
      files,
    });

    return this.json({ message: 'Contest successfully updated!' }, 200);
  }

  @httpDelete('/:id', TYPES.AuthMiddleware, TYPES.IsAuthorMiddleware)
  public async remove(req: Request<FindParams>): Promise<results.JsonResult> {
    await this.contestService.removeContest(req.params.id);

    return this.json({ message: 'Contest successfully deleted!' }, 200);
  }
}
