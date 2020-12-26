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
  UsePipes,
} from '@nestjs/common';

import { TYPES } from '../../injectable.types';
import { IAuthService } from '../../abstract/auth.service.interface';
import { JoiValidationPipe } from '../../pipes/JoiValidationPipe';
import {
  loginSchema,
  registerSchema,
  refreshTokenLocation,
} from './auth.schema';
import {
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthTokenDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
  RefreshTokenLocation,
} from '@lets-choose/common';
import { HttpResponseMessageDto } from '@lets-choose/common';

@Controller('/api/auth')
export class AuthController {
  constructor(
    @Inject(TYPES.AuthService)
    private readonly authService: IAuthService,
  ) {}

  @Post('/login')
  @UsePipes(new JoiValidationPipe(loginSchema))
  async login(@Body() dto: AuthLoginDto): Promise<AuthTokenDto> {
    return await this.authService.loginUser(dto);
  }

  @Post('/register')
  @UsePipes(new JoiValidationPipe(registerSchema))
  public async register(
    @Body() dto: AuthRegisterDto,
  ): Promise<HttpResponseMessageDto> {
    await this.authService.registerUser(dto);

    return { message: 'User successfully created!' };
  }

  @Post('/password/forgot')
  public async forgotPassword(
    @Body() dto: AuthForgotPasswordDto,
  ): Promise<HttpResponseMessageDto> {
    await this.authService.requestPasswordReset(dto);

    return { message: `Reset password link has been sent to ${dto.email}!` };
  }

  @Post('/password/reset/:token')
  public async resetPassword(
    @Param('token') token: string,
    @Body() { password }: AuthResetPasswordDto,
  ): Promise<HttpResponseMessageDto> {
    await this.authService.resetUsersPassword(token, password);

    return { message: 'Password was successfully changed!' };
  }

  @Post('/token')
  @UsePipes(new JoiValidationPipe(refreshTokenLocation, 'query'))
  public async refreshToken(
    @Request() req: any,
    @Response() res: any,
    @Query('refreshTokenLocation') refreshTokenLocation: RefreshTokenLocation,
  ): Promise<HttpResponseMessageDto> {
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
  public async confirmEmail(
    @Param('token') token: string,
  ): Promise<HttpResponseMessageDto> {
    await this.authService.confirmEmail(token);
    return { message: 'Email was successfully verified!' };
  }
}
