import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Param,
  Post,
  Query,
  Request,
  Response,
} from '@nestjs/common';

import { TYPES } from '../../injectable.types';
import { IAuthService, LoginData } from '../../abstract/auth.service.interface';

@Controller('/api/auth')
export class AuthController {
  constructor(
    @Inject(TYPES.AuthService) private readonly authService: IAuthService,
  ) {}

  @Post('/login')
  async login(
    @Body('login') login: string,
    @Body('password') password: string,
  ): Promise<LoginData> {
    console.log(login, password);
    return await this.authService.loginUser(login, password);
  }

  @Post('/register')
  public async register(
    @Body('email') email: string,
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
    await this.authService.registerUser({ email, username, password });

    return { message: 'User successfully created!' };
  }

  @Post('/password/forgot')
  public async forgotPassword(@Body('email') email: string): Promise<any> {
    await this.authService.requestPasswordReset(email);

    return { message: `Reset password link has been sent to ${email}!` };
  }

  @Post('/password/reset/:token')
  public async resetPassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ): Promise<any> {
    await this.authService.resetUsersPassword(token, password);

    return { message: 'Password was successfully changed!' };
  }

  @Post('/token')
  public async refreshToken(
    @Request() req: any,
    @Response() res: any,
    @Query('refreshTokenLocation') refreshTokenLocation: string,
  ): Promise<any> {
    let token;

    if (refreshTokenLocation === 'body') {
      token = req.body.refreshToken;
    } else {
      token = req.cookies?.jid;
    }

    if (!token) {
      throw new BadRequestException('Invalid token');
    }

    const {
      userId,
      accessToken,
      refreshToken,
    } = await this.authService.refreshToken(token);

    const responseBody: any = {
      userId,
      accessToken,
    };

    res.cookie('jid', refreshToken, {
      httpOnly: true,
    });

    if (refreshTokenLocation === 'body') {
      responseBody.refreshToken = refreshToken;
    }

    return responseBody;
  }

  @Post('/email/confirm/:token')
  public async confirmEmail(@Param('token') token: string): Promise<any> {
    await this.authService.confirmEmail(token);
    return { message: 'Email was successfully verified!' };
  }
}
