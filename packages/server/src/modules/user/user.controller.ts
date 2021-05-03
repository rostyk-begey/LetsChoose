import { HttpResponseMessageDto } from '@lets-choose/common';
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from './user.entity';
import { TYPES } from '../../injectable.types';
import { IUserService } from '../../abstract/user.service.interface';

@ApiTags('User')
@Controller('/api/users')
export class UserController {
  constructor(
    @Inject(TYPES.UserService)
    private readonly userService: IUserService,
  ) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  public me(@Request() req: any): Promise<User> {
    return req.user;
  }

  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({ status: 200, type: User })
  @Get('/:username')
  async findById(@Param('username') username: string): Promise<User> {
    return await this.userService.findByUsername(username);
  }

  @ApiOperation({ summary: 'Delete current user' })
  @ApiResponse({ status: 200, type: HttpResponseMessageDto })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/me')
  public async removeMe(@Request() req: any): Promise<HttpResponseMessageDto> {
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
