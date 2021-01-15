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
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import {
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthTokenDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
  RefreshTokenLocation,
  HttpResponseMessageDto,
} from '@lets-choose/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { JwtConfig } from '../../config';
import { TYPES } from '../../injectable.types';
import { IAuthService } from '../../abstract/auth.service.interface';
import { JoiValidationPipe } from '../../pipes/JoiValidationPipe';
import {
  loginSchema,
  registerSchema,
  refreshTokenLocation,
} from './auth.schema';

const MAX_AGE = 60 * 60 * 8; // 8 hours
const getCookieOptions = () => ({
  maxAge: MAX_AGE,
  expires: new Date(Date.now() + MAX_AGE * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  sameSite: 'lax',
});

@Controller('/api/auth')
export class AuthController {
  config: JwtConfig;

  constructor(
    @Inject(TYPES.AuthService)
    private readonly authService: IAuthService,

    protected readonly configService: ConfigService,
  ) {
    this.config = configService.get<JwtConfig>('jwt');
  }

  @Post('/login')
  @UsePipes(new JoiValidationPipe(loginSchema))
  async login(
    @Response({ passthrough: true }) res: any,
    @Body() dto: AuthLoginDto,
  ): Promise<AuthTokenDto> {
    const result = await this.authService.loginUser(dto);

    res.cookie(
      this.config.accessTokenKey,
      result.accessToken,
      getCookieOptions(),
    );
    res.cookie(
      this.config.refreshTokenKey,
      result.refreshToken,
      getCookieOptions(),
    );

    return result;
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @Response({ passthrough: true }) res: any,
  ): Promise<HttpResponseMessageDto> {
    res.clearCookie(this.config.accessTokenKey);
    res.clearCookie(this.config.refreshTokenKey);

    return { message: 'You have logged out' };
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
      token = req.cookies?.refreshToken;
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

    res.cookie(this.config.accessTokenKey, accessToken, getCookieOptions());
    res.cookie(this.config.refreshTokenKey, refreshToken, getCookieOptions());

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
