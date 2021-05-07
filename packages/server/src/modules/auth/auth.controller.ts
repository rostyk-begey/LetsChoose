import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Logger,
  Param,
  Post,
  Query,
  Request,
  Response,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import {
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthTokenDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
  RefreshTokenLocation,
  HttpResponseMessageDto,
  AuthGoogleLoginDto,
} from '@lets-choose/common';

import { JwtConfig } from '../../config';
import { TYPES } from '../../injectable.types';
import { IAuthService } from '../../abstract/auth.service.interface';
import { JoiValidationPipe } from '../../pipes/joi-validation.pipe';
import {
  loginSchema,
  registerSchema,
  refreshTokenLocation,
} from './auth.validation';

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  private readonly config: JwtConfig;
  private readonly useSecureCookie: boolean;
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject(TYPES.AuthService)
    private readonly authService: IAuthService,

    protected readonly configService: ConfigService,
  ) {
    this.config = configService.get<JwtConfig>('jwt');
    this.useSecureCookie =
      configService.get<boolean>('useSSL') &&
      process.env.NODE_ENV === 'production';
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

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: AuthTokenDto })
  @UsePipes(new JoiValidationPipe(loginSchema))
  async login(
    @Response({ passthrough: true }) res: any,
    @Body() dto: AuthLoginDto,
  ): Promise<AuthTokenDto> {
    this.logger.log(dto, 'login');
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

  @Post('/login/google')
  @ApiOperation({ summary: 'Login using google' })
  @ApiResponse({ status: 200, type: AuthTokenDto })
  async loginGoogle(
    @Response({ passthrough: true }) res: any,
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

  @Post('/logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, type: HttpResponseMessageDto })
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @Response({ passthrough: true }) res: any,
  ): Promise<HttpResponseMessageDto> {
    res.clearCookie(this.config.accessTokenKey);
    res.clearCookie(this.config.refreshTokenKey);

    return { message: 'You have been logged out' };
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: 200, type: HttpResponseMessageDto })
  @UsePipes(new JoiValidationPipe(registerSchema))
  public async register(
    @Response({ passthrough: true }) res: any,
    @Body() dto: AuthRegisterDto,
  ): Promise<AuthTokenDto> {
    await this.authService.registerUser(dto);

    return await this.login(res, {
      login: dto.username,
      password: dto.password,
    });
  }

  @Post('/password/forgot')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, type: HttpResponseMessageDto })
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
    @Response({ passthrough: true }) res: any,
    @Query('refreshTokenLocation') refreshTokenLocation: RefreshTokenLocation,
  ): Promise<AuthTokenDto> {
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

  @Post('/email/confirm/:token')
  public async confirmEmail(
    @Param('token') token: string,
  ): Promise<HttpResponseMessageDto> {
    await this.authService.confirmEmail(token);
    return { message: 'Email was successfully verified!' };
  }
}
