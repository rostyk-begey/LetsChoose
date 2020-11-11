import fetch from 'node-fetch';
import { Response } from 'express';
import NodeHashCash from 'node-hashcash';
import { mongoose } from '@typegoose/typegoose';
import { validationResult } from 'express-validator';
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  requestParam,
  requestBody,
  results,
  request,
  response,
  httpDelete,
} from 'inversify-express-utils';

import { TYPES } from '../../inversify.types';
import { Status, TaskModel } from '../../models/Task';
import { AppError } from '../../usecases/error';
import { RequestWithUserId } from '../../types';
import { newTaskSchema } from '../../schema/task';
import config from '../../config';

interface CreateTaskBody {
  title: string;
  secret: string;
  hardness: number;
}

const applicationServers = config.workerUrls.map((url) => ({ url, load: 0 }));

@controller('/api/tasks')
export default class TaskController extends BaseHttpController {
  @httpGet('/', TYPES.AuthMiddleware)
  public async all(
    @request() { userId }: RequestWithUserId,
  ): Promise<results.JsonResult> {
    const tasks = await TaskModel.find({
      // @ts-ignore
      user: mongoose.Types.ObjectId(userId),
    });
    return this.json(tasks, 201);
  }

  @httpPost('/', TYPES.AuthMiddleware, ...newTaskSchema)
  public async new(
    @request() req: RequestWithUserId,
    @response() res: Response,
    @requestBody() { secret, hardness, title }: CreateTaskBody,
  ): Promise<any> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Invalid query', 400, {
        errors: errors.array(),
        message: 'Invalid query',
      });
    }

    const challenge = await NodeHashCash.createChallenge(secret, { hardness });
    const task = new TaskModel({
      _id: mongoose.Types.ObjectId(),
      title,
      challenge,
      hardness,
      user: req.userId,
      status: Status.CREATED,
    });
    await task.save();

    const minLoad = Math.min(...applicationServers.map(({ load }) => load));
    const serverIndex = applicationServers.findIndex(
      ({ load }) => minLoad === load,
    );
    applicationServers[serverIndex].load += hardness;
    const { url } = applicationServers[serverIndex];

    console.log(applicationServers);

    fetch(`${url}/${task._id}`, {
      method: 'post',
    }).then(() => (applicationServers[serverIndex].load -= hardness));

    return this.json(task, 201);
  }

  @httpDelete('/:taskId', TYPES.AuthMiddleware)
  public async delete(
    @request() req: RequestWithUserId,
    @requestParam('taskId') taskId: string,
  ): Promise<any> {
    const task = await TaskModel.findById(taskId);

    if (
      !task ||
      (`${task.user}` !== `${req.userId}` && task.status !== Status.IN_PROGRESS)
    ) {
      return this.statusCode(404);
    } else if (task.status === Status.IN_PROGRESS) {
      return this.statusCode(403);
    }

    await task.remove();

    return this.statusCode(200);
  }
}
