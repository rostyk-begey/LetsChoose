import { Request } from 'express';
import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  results,
} from 'inversify-express-utils';

import { UserFindParams } from './types';
import UserService, { IUserService } from '../../services/UserService';
import { RequestWithUserId } from '../../types';
import auth from '../../middleware/auth.middleware';

@controller('/api/users')
export default class UserController extends BaseHttpController {
  constructor(
    @inject(UserService)
    protected readonly userService: IUserService,
  ) {
    super();
  }

  @httpGet('/me', auth)
  public async me(
    req: RequestWithUserId<UserFindParams>,
  ): Promise<results.JsonResult> {
    const user = await this.userService.findById(req.userId!);
    return this.json(user, 200);
  }

  @httpGet('/:username')
  public async find(
    req: RequestWithUserId<UserFindParams>,
  ): Promise<results.JsonResult> {
    const user = await this.userService.findByUsername(
      req.params.username,
      req.userId,
    );
    return this.json(user, 200);
  }

  // todo: validate permissions
  @httpDelete('/:username')
  public async remove(
    req: Request<UserFindParams>,
  ): Promise<results.JsonResult> {
    await this.userService.removeUserByUsername(req.params.username);
    return this.json({ message: 'User successfully deleted!' }, 200);
  }
}
