import {
  HttpResponseMessageDto,
  UpdateUserProfileDto,
} from '@lets-choose/common/dto';
import { UserService } from '@modules/user/user.service';
import { updateUserProfileSchema } from '@modules/user/user.validation';
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

import { User } from './user.entity';
import { JoiValidationPipe } from '@pipes/joi-validation.pipe';
import { TYPES } from '@src/injectable.types';
import { IUserService } from '@abstract/user.service.interface';

@ApiTags('User')
@Controller('/api/users')
export class UserController {
  constructor(
    @Inject(UserService)
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
  async findByUsername(@Param('username') username: string): Promise<User> {
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
  ): Promise<User> {
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
