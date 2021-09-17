import { IUserService } from '@lets-choose/api/abstract';
import { JoiValidationPipe } from '@lets-choose/api/common/pipes';

import { User } from '@lets-choose/api/user/data-access';
import {
  HttpResponseMessageDto,
  UpdateUserProfileDto,
  UserDto,
} from '@lets-choose/common/dto';
import { API_ROUTES } from '@lets-choose/common/utils';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { updateUserProfileSchema } from './user.validation';

@ApiTags('User')
@Controller(API_ROUTES.USERS)
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: IUserService,
  ) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  public me(@Request() req: any): User {
    return req.user;
  }

  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({ status: 200, type: User })
  @Get('/:username')
  async findByUsername(@Param('username') username: string): Promise<UserDto> {
    return await this.userService.findByUsername(username);
  }

  @ApiOperation({ summary: "Update user's profile" })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new JoiValidationPipe(updateUserProfileSchema))
  @Post('/profile')
  async updateUserProfile(
    @Request() req: any,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<UserDto> {
    return await this.userService.updateUserProfile(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Delete current user' })
  @ApiResponse({ status: 200, type: HttpResponseMessageDto })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/me')
  public async removeMe(@Request() req: any): Promise<HttpResponseMessageDto> {
    await this.userService.removeUserById(req.user.id as string);
    return { message: 'User successfully deleted!' };
  }
}
