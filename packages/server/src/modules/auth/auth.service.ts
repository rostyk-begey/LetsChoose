import {
  AuthForgotPasswordDto,
  AuthGoogleLoginDto,
  AuthLoginDto,
  AuthRegisterDto,
  AuthTokenDto,
} from '@lets-choose/common';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import md5 from 'md5';

import { IAuthService } from '@abstract/auth.service.interface';
import { IEmailService } from '@abstract/email.service.interface';
import { IJwtService } from '@abstract/jwt.service.interface';
import { IPasswordHashService } from '@abstract/password.service.interface';
import { IUserRepository } from '@abstract/user.repository.interface';
import { User } from '@modules/user/user.entity';
import { GoogleOAuth } from '@src/config';
import { TYPES } from '@src/injectable.types';

@Injectable()
export class AuthService implements IAuthService {
  private readonly config: {
    appUrl: string;
    googleOAuth: GoogleOAuth;
  };

  private readonly OAuth2Client: OAuth2Client;

  constructor(
    @Inject(TYPES.UserRepository)
    protected readonly userRepository: IUserRepository,

    @Inject(TYPES.JwtService)
    protected readonly jwtService: IJwtService,

    @Inject(TYPES.EmailService)
    protected readonly emailService: IEmailService,

    @Inject(TYPES.PasswordHashService)
    protected readonly passwordHashService: IPasswordHashService,

    protected readonly configService: ConfigService,
  ) {
    this.config = {
      appUrl: configService.get('appUrl'),
      googleOAuth: configService.get<GoogleOAuth>('googleOAuth'),
    };

    this.OAuth2Client = new OAuth2Client(
      this.config.googleOAuth.clientId,
      this.config.googleOAuth.clientSecret,
      /**
       * To get access_token and refresh_token in server side,
       * the data for redirect_uri should be postmessage.
       * postmessage is magic value for redirect_uri to get credentials without actual redirect uri.
       */
      'postmessage',
    );
  }

  private async baseRegisterUser({
    email,
    username,
    password,
    avatar,
  }: { avatar?: string } & AuthRegisterDto): Promise<User> {
    const hashedPassword: string = await this.passwordHashService.hash(
      password,
      12,
    );

    return await this.userRepository.createUser({
      email,
      username,
      password: hashedPassword,
      avatar:
        avatar ||
        `https://www.gravatar.com/avatar/${md5(email)}?s=200&d=identicon`,
      bio: '',
    });
  }

  public async registerUser({
    email,
    username,
    password,
  }: AuthRegisterDto): Promise<void> {
    if (await this.userRepository.findByEmail(email)) {
      throw new BadRequestException('User with this email already exists');
    } else if (await this.userRepository.findByUsername(username)) {
      throw new BadRequestException('Username already taken');
    }

    const user = await this.baseRegisterUser({
      email,
      username,
      password,
    });

    const emailToken = this.jwtService.generateEmailToken(user.id);

    this.emailService.sendRegistrationEmail(
      user.email,
      `${this.config.appUrl}/email/confirm/${emailToken}`,
    );
  }

  public async loginUser({
    login,
    password,
  }: AuthLoginDto): Promise<AuthTokenDto> {
    let user = await this.userRepository.findByEmail(login);

    if (!user) {
      user = await this.userRepository.findByUsername(login);
    }

    if (!user) {
      throw new UnauthorizedException('User not exists!');
    }

    const isMatch = await this.passwordHashService.compare(
      password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Incorrect login data');
    }

    // TODO: update email confirmation
    // if (!user.confirmed) {
    //   throw new UnauthorizedException('Email confirmation needed');
    // }

    const { accessToken, refreshToken } = this.jwtService.generateAuthTokenPair(
      user.id,
      user.passwordVersion,
    );

    return {
      userId: user.id,
      accessToken,
      refreshToken,
    };
  }

  public async loginUserOAuth(dto: AuthGoogleLoginDto): Promise<AuthTokenDto> {
    const { email, picture } = await this.getOAuthProfile(dto);
    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      user = await this.baseRegisterUser({
        email,
        username: email.split('@')[0],
        password: '',
        avatar: picture,
      });
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { accessToken, refreshToken } = this.jwtService.generateAuthTokenPair(
      user.id,
      user.passwordVersion,
    );

    return {
      userId: user.id,
      accessToken,
      refreshToken,
    };
  }

  private async getOAuthProfile({ token: idToken }: AuthGoogleLoginDto) {
    const ticket = await this.OAuth2Client.verifyIdToken({
      idToken,
      audience: this.config.googleOAuth.clientId,
    });

    return ticket.getPayload();
  }

  public async requestPasswordReset({
    email,
  }: AuthForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetPasswordToken = this.jwtService.generateResetPasswordToken(
      user.id,
    );

    this.emailService.sendResetPasswordEmail(
      user.email,
      `${this.config.appUrl}/password/reset/${resetPasswordToken}`,
    );
  }

  public async resetUsersPassword(
    token: string,
    password: string,
  ): Promise<void> {
    let userId = '';

    try {
      ({ userId } = this.jwtService.verifyPasswordResetToken(token));
    } catch (e) {
      throw new UnauthorizedException('Reset password link expired');
    }

    const user = await this.userRepository.findByIdOrFail(userId);

    const newPassword = await this.passwordHashService.hash(password, 12);

    await this.userRepository.findByIdAndUpdate(user.id, {
      password: newPassword,
      passwordVersion: user.passwordVersion + 1,
    });
  }

  public async refreshToken(token: string): Promise<AuthTokenDto> {
    let userId;

    try {
      ({ userId } = this.jwtService.verifyRefreshToken(token));
    } catch (e) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.userRepository.findByIdOrFail(userId);

    const { accessToken, refreshToken } = this.jwtService.generateAuthTokenPair(
      user.id,
      user.passwordVersion,
    );

    return {
      userId,
      accessToken,
      refreshToken,
    };
  }

  public async confirmEmail(confirmEmailToken: string): Promise<void> {
    try {
      const { userId } = this.jwtService.verifyEmailToken(confirmEmailToken);
      await this.userRepository.findByIdAndUpdate(userId, { confirmed: true });
    } catch (e) {
      throw new BadRequestException('Invalid url');
    }
  }
}
