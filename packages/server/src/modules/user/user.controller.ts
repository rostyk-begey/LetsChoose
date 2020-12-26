import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from './user.schema';
import { TYPES } from '../../injectable.types';
import { IUserService } from '../../abstract/user.service.interface';

@Controller('/api/users')
export class UserController {
  constructor(
    @Inject(TYPES.UserService)
    private readonly userService: IUserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  public me(@Request() req: any): Promise<User> {
    return req.user;
  }

  @Get('/:username')
  async findById(@Param('username') username: string): Promise<User> {
    return await this.userService.findByUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/me')
  public async removeMe(@Request() req: any): Promise<any> {
    await this.userService.removeUserById(req.user.id as string);
    return { message: 'User successfully deleted!' };
  }

  // todo: validate permissions
  // @httpDelete('/:username', TYPES.AuthMiddleware)
  // public async remove(
  //   @requestParam('username') username: string,
  // ): Promise<results.JsonResult> {
  //   await this.userService.removeUserByUsername(username);
  //   return this.json({ message: 'User successfully deleted!' }, 200);
  // }
}
