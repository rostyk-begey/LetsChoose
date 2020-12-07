import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import md5 from 'md5';

import { User } from '../user/user.schema';
import { TYPES } from '../../injectable.types';
import { IUserRepository } from '../../abstract/user.repository.interface';
import { IPasswordHashService } from '../common/password/password.service';
import {
  IAuthService,
  RegisterUserData,
} from '../../abstract/auth.service.interface';
import { IJwtService } from '../../abstract/jwt.service.interface';
import { IEmailService } from '../../abstract/email.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  private readonly config: {
    appUrl: string;
  };

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
    };
  }

  public async registerUser({
    email,
    username,
    password,
  }: RegisterUserData): Promise<void> {
    const hashedPassword: string = await this.passwordHashService.hash(
      password,
      12,
    );

    const user = await this.userRepository.createUser({
      email,
      username,
      password: hashedPassword,
      avatar: `https://www.gravatar.com/avatar/${md5(email)}?s=200&d=identicon`,
      bio: '',
    });

    const emailToken = this.jwtService.generateEmailToken(user.id);

    this.emailService.sendRegistrationEmail(
      user.email,
      `${this.config.appUrl}/email/confirm/${emailToken}`,
    );
  }

  public async loginUser(
    login: string,
    password: string,
  ): Promise<{
    userId: string;
    accessToken: string;
    refreshToken: string;
  }> {
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

    if (!user.confirmed) {
      throw new UnauthorizedException('Email confirmation needed');
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

  public async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      // throw new AppError('Invalid email', 404);
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
  ): Promise<User> {
    let userId = '';

    try {
      ({ userId } = this.jwtService.verifyPasswordResetToken(token));
    } catch (e) {
      // throw new AppError('Reset password link expired', 403);
    }

    const user = await this.userRepository.findByIdOrFail(userId);

    const newPassword = await this.passwordHashService.hash(password, 12);

    return this.userRepository.findByIdAndUpdate(user.id, {
      password: newPassword,
      passwordVersion: user.passwordVersion + 1,
    });
  }

  public async refreshToken(
    token: string,
  ): Promise<{
    userId: string;
    accessToken: string;
    refreshToken: string;
  }> {
    let userId;

    if (!token) {
      throw new BadRequestException('Invalid token');
    }

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
