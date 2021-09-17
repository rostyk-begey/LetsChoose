import { Config } from '@lets-choose/api/config';
import {
  AuthForgotPasswordDto,
  AuthGoogleLoginDto,
  AuthLoginDto,
  AuthRegisterDto,
  AuthTokenDto,
  UpdateUserPasswordDto,
  UserDto,
} from '@lets-choose/common/dto';
import {
  JwtService,
  EmailService,
  PasswordHashService,
} from '@lets-choose/api/common/services';
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

import {
  IAuthService,
  IEmailService,
  IJwtService,
  IPasswordHashService,
  IUserRepository,
} from '@lets-choose/api/abstract';
import { UserRepository } from '@lets-choose/api/user/data-access';
import { GoogleOAuthConfig } from '@lets-choose/api/config';

@Injectable()
export class AuthService implements IAuthService {
  private readonly config: {
    appUrl: string;
    googleOAuth: GoogleOAuthConfig;
  };

  private readonly OAuth2Client: OAuth2Client;

  constructor(
    @Inject(UserRepository)
    protected readonly userRepository: IUserRepository,

    @Inject(JwtService)
    protected readonly jwtService: IJwtService,

    @Inject(EmailService)
    protected readonly emailService: IEmailService,

    @Inject(PasswordHashService)
    protected readonly passwordHashService: IPasswordHashService,

    protected readonly configService: ConfigService<Config>,
  ) {
    this.config = {
      appUrl: configService.get('appUrl', { infer: true }),
      googleOAuth: configService.get('googleOAuth', { infer: true }),
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
  }: { avatar?: string } & AuthRegisterDto): Promise<UserDto> {
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

    const emailToken = this.jwtService.generateEmailToken(user._id);

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
      user._id,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      user.passwordVersion,
    );

    return {
      userId: user._id,
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
      user._id,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      user.passwordVersion,
    );

    return {
      userId: user._id,
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
      user._id,
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

    await this.userRepository.findByIdAndUpdate(user._id, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      password: newPassword,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      passwordVersion: user.passwordVersion + 1,
    });
  }

  public async updateUsersPassword(
    userId: string,
    { password, newPassword }: UpdateUserPasswordDto,
  ): Promise<AuthTokenDto> {
    const user = await this.userRepository.findByIdOrFail(userId);

    const isMatch = await this.passwordHashService.compare(
      password,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    const newPasswordHash = await this.passwordHashService.hash(
      newPassword,
      12,
    );

    await this.userRepository.findByIdAndUpdate(user._id, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      password: newPasswordHash,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      passwordVersion: ++user.passwordVersion,
    });

    const { accessToken, refreshToken } = this.jwtService.generateAuthTokenPair(
      user._id,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      user.passwordVersion,
    );

    return {
      userId: user._id,
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(token: string): Promise<AuthTokenDto> {
    let userId: string, passwordVersion: number;

    try {
      ({ userId, passwordVersion } = this.jwtService.verifyRefreshToken(token));

      const user = await this.userRepository.findByIdOrFail(userId);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (passwordVersion !== user.passwordVersion) {
        throw new Error();
      }

      const { accessToken, refreshToken } =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.jwtService.generateAuthTokenPair(user.id, user.passwordVersion);

      return {
        userId,
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  public async confirmEmail(confirmEmailToken: string): Promise<void> {
    try {
      const { userId } = this.jwtService.verifyEmailToken(confirmEmailToken);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await this.userRepository.findByIdAndUpdate(userId, { confirmed: true });
    } catch (e) {
      throw new BadRequestException('Invalid url');
    }
  }
}
