import md5 from 'md5';

import { User } from '../models/User';
import { AppError } from '../usecases/error';
import { ContestModel } from '../models/Contest';
import { ContestItemModel } from '../models/ContestItem';
import EmailService from './EmailService';
import JwtService from './JwtService';
import config from '../config';
import { IUserRepository } from '../repositories/UserRepository';
import PasswordHashService from './PasswordHashService';

interface RegisterUserData {
  email: string;
  username: string;
  password: string;
}

export class UserService {
  private userRepository: IUserRepository;

  private jwtService: JwtService;

  private emailService: EmailService;

  private passwordHashService: PasswordHashService;

  constructor(
    userRepository: IUserRepository,
    jwtService: JwtService,
    emailService: EmailService,
    passwordHashService: PasswordHashService,
  ) {
    this.jwtService = jwtService;
    this.emailService = emailService;
    this.userRepository = userRepository;
    this.passwordHashService = passwordHashService;
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
      `${config.appUrl}/email/confirm/${emailToken}`,
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
    let user = await this.userRepository.findOne({ email: login });

    if (!user) {
      user = await this.userRepository.findOne({ username: login });
    }

    if (!user) {
      throw new AppError('User not exists!', 400);
    }

    const isMatch = await this.passwordHashService.compare(
      password,
      user.password,
    );

    if (!isMatch) {
      throw new AppError('Incorrect login data', 400);
    }

    if (!user.confirmed) {
      throw new AppError('Email confirmation needed', 403);
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
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new AppError('Invalid email', 404);
    }

    const resetPasswordToken = this.jwtService.generateResetPasswordToken(
      user.id,
    );

    this.emailService.sendResetPasswordEmail(
      user.email,
      `${config.appUrl}/password/reset/${resetPasswordToken}`,
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
      throw new AppError('Reset password link expired', 403);
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

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

    if (!token) throw new AppError('Invalid token', 400);

    try {
      ({ userId } = this.jwtService.verifyRefreshToken(token));
    } catch (e) {
      throw new AppError('Invalid signature', 400);
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Invalid token', 400);
    }

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

  public async findByUsernameOrReturnCurrentUser(
    username: string,
    currentUserId?: string,
  ): Promise<User> {
    let user: User;
    if (username === 'me' && currentUserId) {
      user = await this.userRepository.findById(currentUserId as string);
    } else {
      user = await this.userRepository.findOne({ username });
    }
    if (!user) throw new AppError('Resource not found!', 404);
    return user;
  }

  public async confirmEmail(confirmEmailToken: string): Promise<void> {
    try {
      const { userId } = this.jwtService.verifyEmailToken(confirmEmailToken);
      await this.userRepository.findByIdAndUpdate(userId, { confirmed: true });
    } catch (e) {
      throw new AppError('Invalid url', 400);
    }
  }

  public async removeUserByUsername(username: string): Promise<void> {
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new AppError('User does not exists', 404);
    }

    const contests = await ContestModel.find({ author: user.id });
    const deletes = contests.map(async (contest) => {
      await ContestItemModel.deleteMany({ contestId: contest.id });
      await ContestModel.findByIdAndDelete(contest.id);
    });
    await Promise.all(deletes);
  }
}
