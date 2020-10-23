import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  requestParam,
  results,
} from 'inversify-express-utils';

import { UserFindParams } from './types';
import { IUserService } from '../../services/UserService';
import { RequestWithUserId } from '../../types';
import AuthMiddleware from '../../middleware/AuthMiddleware';
import { TYPES } from '../../inversify.types';

@controller('/api/users')
export default class UserController extends BaseHttpController {
  constructor(
    @inject(TYPES.UserService)
    protected readonly userService: IUserService,
  ) {
    super();
  }

  @httpGet('/me', TYPES.AuthMiddleware)
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

  @httpDelete('/me', TYPES.AuthMiddleware)
  public async removeMe(req: RequestWithUserId): Promise<results.JsonResult> {
    await this.userService.removeUserById(req.userId as string);
    return this.json({ message: 'User successfully deleted!' }, 200);
  }

  // todo: validate permissions
  @httpDelete('/:username', TYPES.AuthMiddleware)
  public async remove(
    @requestParam('username') username: string,
  ): Promise<results.JsonResult> {
    await this.userService.removeUserByUsername(username);
    return this.json({ message: 'User successfully deleted!' }, 200);
  }
}
