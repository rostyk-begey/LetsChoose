import { IAuthService, UserDto } from '@lets-choose/api/abstract';
import { AuthUser } from '@lets-choose/api/common/decorators';
import { JoiValidationPipe } from '@lets-choose/api/common/pipes';
import { Config, JwtConfig } from '@lets-choose/api/config';
import {
  AuthForgotPasswordDto,
  AuthGoogleLoginDto,
  AuthLoginDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
  AuthTokenDto,
  HttpResponseMessageDto,
  RefreshTokenLocation,
  UpdateUserPasswordDto,
} from '@lets-choose/common/dto';
import { API_ROUTES } from '@lets-choose/common/utils';
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
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { AuthService } from './auth.service';
import {
  loginSchema,
  refreshTokenLocation,
  registerSchema,
  updatePasswordSchema,
} from './auth.validation';

@ApiTags('auth')
@Controller()
export class AuthController {
  private readonly config: JwtConfig;
  private readonly useSecureCookie: boolean;

  constructor(
    @Inject(AuthService)
    private readonly authService: IAuthService,

    protected readonly configService: ConfigService<Config>,
  ) {
    this.config = configService.get<JwtConfig>('jwt', { infer: true });
    this.useSecureCookie =
      configService.get<boolean>('useSSL', { infer: true }) &&
      configService.get<boolean>('environment', { infer: true }) ===
        'production';
  }

  private getCookieOptions(): any {
    // TODO: update
    const MAX_AGE = 0.5; //60 * 60 * 8; // 8 hours
    return {
      // maxAge: MAX_AGE,
      // expires: new Date(Date.now() + MAX_AGE * 1000),
      httpOnly: true,
      secure: this.useSecureCookie,
      path: '/',
      sameSite: 'lax',
    };
  }

  @Post(API_ROUTES.AUTH.LOGIN)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: AuthTokenDto })
  @UsePipes(new JoiValidationPipe(loginSchema))
  async login(
    @Response({ passthrough: true }) res: any,
    @Body() dto: AuthLoginDto,
  ): Promise<AuthTokenDto> {
    const result = await this.authService.loginUser(dto);

    res.cookie(
      this.config.accessTokenKey,
      result.accessToken,
      this.getCookieOptions(),
    );
    res.cookie(
      this.config.refreshTokenKey,
      result.refreshToken,
      this.getCookieOptions(),
    );

    return result;
  }

  @Post(API_ROUTES.AUTH.LOGIN_GOOGLE)
  @ApiOperation({ summary: 'Login using google' })
  @ApiResponse({ status: 200, type: AuthTokenDto })
  async loginGoogle(
    @Response({ passthrough: true }) res: ExpressResponse,
    @Body() dto: AuthGoogleLoginDto,
  ): Promise<AuthTokenDto> {
    const result = await this.authService.loginUserOAuth(dto);

    res.cookie(
      this.config.accessTokenKey,
      result.accessToken,
      this.getCookieOptions(),
    );
    res.cookie(
      this.config.refreshTokenKey,
      result.refreshToken,
      this.getCookieOptions(),
    );

    return result;
  }

  @Post(API_ROUTES.AUTH.LOGOUT)
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, type: HttpResponseMessageDto })
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<HttpResponseMessageDto> {
    res.clearCookie(this.config.accessTokenKey);
    res.clearCookie(this.config.refreshTokenKey);

    return { message: 'You have been logged out' };
  }

  @Post(API_ROUTES.AUTH.REGISTER)
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: 200, type: HttpResponseMessageDto })
  @UsePipes(new JoiValidationPipe(registerSchema))
  public async register(
    @Response({ passthrough: true }) res: ExpressResponse,
    @Body() dto: AuthRegisterDto,
  ): Promise<AuthTokenDto> {
    await this.authService.registerUser(dto);

    return await this.login(res, {
      login: dto.username,
      password: dto.password,
    });
  }

  @Post(API_ROUTES.AUTH.FORGOT_PASSWORD)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, type: HttpResponseMessageDto })
  public async forgotPassword(
    @Body() dto: AuthForgotPasswordDto,
  ): Promise<HttpResponseMessageDto> {
    await this.authService.requestPasswordReset(dto);

    return { message: `Reset password link has been sent to ${dto.email}!` };
  }

  @Post(API_ROUTES.AUTH.UPDATE_PASSWORD)
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, type: HttpResponseMessageDto })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new JoiValidationPipe(updatePasswordSchema))
  public async updatePassword(
    @AuthUser() user: UserDto,
    @Response({ passthrough: true }) res: ExpressResponse,
    @Body() dto: UpdateUserPasswordDto,
  ): Promise<AuthTokenDto> {
    const result = await this.authService.updateUsersPassword(user.id, dto);

    res.cookie(
      this.config.accessTokenKey,
      result.accessToken,
      this.getCookieOptions(),
    );
    res.cookie(
      this.config.refreshTokenKey,
      result.refreshToken,
      this.getCookieOptions(),
    );

    return result;
  }

  @Post(`${API_ROUTES.AUTH.RESET_PASSWORD}/:token`)
  public async resetPassword(
    @Param('token') token: string,
    @Body() { password }: AuthResetPasswordDto,
  ): Promise<HttpResponseMessageDto> {
    await this.authService.resetUsersPassword(token, password);

    return { message: 'Password was successfully changed!' };
  }

  @Post(API_ROUTES.AUTH.REFRESH_TOKEN)
  // @UsePipes(new JoiValidationPipe(refreshTokenLocation, 'query'))
  public async refreshToken(
    @Request()
    req: ExpressRequest<unknown, AuthTokenDto, { refreshToken?: string }>,
    @Response({ passthrough: true }) res: ExpressResponse,
    @Query('refreshTokenLocation') refreshTokenLocation: RefreshTokenLocation,
  ): Promise<AuthTokenDto> {
    let token;

    if (refreshTokenLocation === 'body') {
      token = req.body?.refreshToken;
    } else {
      token = req.cookies?.refreshToken;
    }

    if (!token) {
      throw new BadRequestException('Invalid token');
    }

    const { userId, accessToken, refreshToken } =
      await this.authService.refreshToken(token);

    res.cookie(
      this.config.accessTokenKey,
      accessToken,
      this.getCookieOptions(),
    );
    res.cookie(
      this.config.refreshTokenKey,
      refreshToken,
      this.getCookieOptions(),
    );

    return {
      userId,
      accessToken,
      ...(refreshTokenLocation === 'body' && { refreshToken }),
    };
  }

  @Post(`${API_ROUTES.AUTH.CONFIRM_EMAIL}/:token`)
  public async confirmEmail(
    @Param('token') token: string,
  ): Promise<HttpResponseMessageDto> {
    await this.authService.confirmEmail(token);
    return { message: 'Email was successfully verified!' };
  }
}
