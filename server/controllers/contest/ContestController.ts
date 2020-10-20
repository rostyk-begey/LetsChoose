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
import {
  CreateBody,
  FindParams,
  GetItemsQuery,
  GetQuery,
  SORT_OPTIONS,
} from './types';
import ContestService, { IContestService } from '../../services/ContestService';
import { RequestWithUserId, ResponseMessage } from '../../types';
import auth from '../../middleware/auth.middleware';
import {
  createContestSchema,
  getContestItemsSchema,
  getContestSchema,
  updateContestSchema,
} from '../../schema/contest';
// import isAuthor from '../../middleware/auth.middleware';

@controller('/api/contests')
export default class ContestController extends BaseHttpController {
  constructor(
    @inject(ContestService)
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

  @httpPost('/', auth, ...createContestSchema)
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

  @httpPost('/:id', auth, ...updateContestSchema)
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
      files,
      params: { id: contestId },
      body: { title, excerpt },
    } = req;

    await this.contestService.updateContest(contestId, {
      title,
      excerpt,
      files: files as Express.Multer.File[],
    });

    return this.json({ message: 'Contest successfully updated!' }, 200);
  }

  @httpDelete('/:id', auth)
  public async remove(req: Request<FindParams>): Promise<results.JsonResult> {
    await this.contestService.removeContest(req.params.id);

    return this.json({ message: 'Contest successfully deleted!' }, 200);
  }
}
