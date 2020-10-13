import bcrypt from 'bcryptjs';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import config from 'config';

import { User, UserModel } from '../models/User';
import { AppError } from '../usecases/error';
import { ContestModel } from '../models/Contest';
import { ContestItemModel } from '../models/ContestItem';
import EmailService from './EmailService';
import JwtService from './JwtService';

interface RegisterUserData {
  email: string;
  username: string;
  password: string;
}

export class UserService {
  private static generateTokenPair(userId: string, passwordVersion = 0) {
    const payload = { userId, passwordVersion };
    const accessToken = JwtService.generateAccessToken(payload);
    const refreshToken = JwtService.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  public static async registerUser({
    email,
    username,
    password,
  }: RegisterUserData): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new UserModel({
      email,
      username,
      password: hashedPassword,
      avatar: `https://www.gravatar.com/avatar/${md5(email)}?s=200&d=identicon`,
      bio: '',
    });
    await user.save();

    const emailToken = JwtService.generateEmailToken(user._id);

    EmailService.sendRegistrationEmail(
      user.email,
      `${config.get('appUrl')}/email/confirm/${emailToken}`,
    );
  }

  public static async loginUser(
    login: string,
    password: string,
  ): Promise<{
    userId: string;
    accessToken: string;
    refreshToken: string;
  }> {
    let user = await UserModel.findOne({ email: login });

    if (!user) {
      user = await UserModel.findOne({ username: login });
    }

    if (!user) {
      throw new AppError('User not exists!', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError('Incorrect login data', 400);
    }

    if (!user.confirmed) {
      throw new AppError('Email confirmation needed', 403);
    }

    const { accessToken, refreshToken } = UserService.generateTokenPair(
      user._id,
      user.passwordVersion,
    );

    return {
      userId: user._id,
      accessToken,
      refreshToken,
    };
  }

  public static async requestPasswordReset(email: string): Promise<void> {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new AppError('Invalid email', 404);
    }

    const resetPasswordToken = JwtService.generateResetPasswordToken(user._id);

    EmailService.sendResetPasswordEmail(
      user.email,
      `${config.get('appUrl')}/password/reset/${resetPasswordToken}`,
    );
  }

  public static async resetUsersPassword(
    token: string,
    password: string,
  ): Promise<void> {
    let userId = '';

    try {
      ({ userId } = JwtService.verifyPasswordResetToken(token));
    } catch (e) {
      throw new AppError('Reset password link expired', 403);
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const newPassword = await bcrypt.hash(password, 12);

    await user.update({
      password: newPassword,
      passwordVersion: user.passwordVersion + 1,
    });
  }

  public static async refreshToken(
    token: string,
  ): Promise<{
    userId: string;
    accessToken: string;
    refreshToken: string;
  }> {
    let userId;

    if (!token) throw new AppError('Invalid token', 400);

    try {
      ({ userId } = JwtService.verifyRefreshToken(token));
    } catch (e) {
      throw new AppError('Invalid signature', 400);
    }

    const user = await UserModel.findById(userId).select('-password');

    if (!user) {
      throw new AppError('Invalid token', 400);
    }

    const { accessToken, refreshToken } = UserService.generateTokenPair(
      user._id,
      user.passwordVersion,
    );

    return {
      userId,
      accessToken,
      refreshToken,
    };
  }

  public static async findByUsernameOrReturnCurrentUser(
    username: string,
    currentUserId?: string,
  ): Promise<User> {
    let user: User;
    if (username === 'me' || currentUserId) {
      user = (await UserModel.findById(currentUserId).select(
        '-password',
      )) as User;
    } else {
      user = (await UserModel.findOne({ username }).select(
        '-password',
      )) as User;
    }
    if (!user) throw new AppError('Resource not found!', 404);
    return user;
  }

  public static async confirmEmail(confirmEmailToken: string): Promise<void> {
    try {
      const { userId } = JwtService.verifyEmailToken(confirmEmailToken);
      await UserModel.findByIdAndUpdate(userId, { confirmed: true });
    } catch (e) {
      throw new AppError('Invalid url', 400);
    }
  }

  public static async removeUserByUsername(username: string): Promise<void> {
    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new AppError('User does not exists', 404);
    }

    const contests = await ContestModel.find({ author: user._id });
    const deletes = contests.map(async (contest) => {
      await ContestItemModel.deleteMany({ contestId: contest.id });
      await ContestModel.findByIdAndDelete(contest.id);
    });
    await Promise.all(deletes);
  }
}
