import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { AppError } from '../../usecases/error';
import {
  UserFindParams,
  LoginResponseBody,
  RequestWithTokenParam,
} from './types';
import { UserService } from '../../services/UserService';
import { RequestWithUserId, ResponseMessage } from '../../types';
import { User } from '../../models/User';

export default class UserController {
  public static async login(
    req: Request,
    res: Response<LoginResponseBody>,
  ): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect login data', 400, {
        errors: errors.array(),
      });
    }

    const { login, password } = req.body;

    const { userId, accessToken, refreshToken } = await UserService.loginUser(
      login,
      password,
    );

    const responseBody: LoginResponseBody = {
      userId,
      accessToken,
    };

    res.cookie('jid', refreshToken, {
      httpOnly: true,
    });

    if (req.query.refreshTokenLocation === 'body') {
      responseBody.refreshToken = refreshToken;
    }

    res.status(200).json(responseBody);
  }

  public static async register(
    req: Request,
    res: Response<ResponseMessage>,
  ): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect registration data', 400, {
        errors: errors.array(),
      });
    }

    const { email, username, password } = req.body;

    await UserService.registerUser({ email, username, password });

    res.status(201).json({ message: 'User successfully created!' });
  }

  public static async forgotPassword(
    req: Request,
    res: Response<ResponseMessage>,
  ): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect email', 400, {
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    await UserService.requestPasswordReset(email);

    res
      .status(201)
      .json({ message: `Reset password link has been sent to ${email}!` });
  }

  public static async resetPassword(
    req: RequestWithTokenParam,
    res: Response<ResponseMessage>,
  ): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect data', 400, {
        errors: errors.array(),
      });
    }

    await UserService.resetUsersPassword(req.params.token, req.body.password);

    res.status(201).json({ message: 'Password was successfully changed!' });
  }

  public static async refreshToken(
    req: Request,
    res: Response<LoginResponseBody>,
  ): Promise<void> {
    let token;

    if (req.query.refreshTokenLocation === 'body') {
      token = req.body.refreshToken;
    } else {
      token = req.cookies?.jid;
    }

    if (!token) {
      throw new AppError('Invalid token', 400);
    }

    const {
      userId,
      accessToken,
      refreshToken,
    } = await UserService.refreshToken(token);

    const responseBody: LoginResponseBody = {
      userId,
      accessToken,
    };

    res.cookie('jid', refreshToken, {
      httpOnly: true,
    });

    if (req.query?.refreshTokenLocation === 'body') {
      responseBody.refreshToken = refreshToken;
    }

    res.status(200).json(responseBody);
  }

  public static async find(
    req: RequestWithUserId<UserFindParams>,
    res: Response<User>,
  ): Promise<void> {
    const user = await UserService.findByUsernameOrReturnCurrentUser(
      req.params.username,
      req.userId,
    );
    res.status(200).json(user);
  }
  public static async confirmEmail(
    req: RequestWithTokenParam,
    res: Response<ResponseMessage>,
  ): Promise<void> {
    await UserService.confirmEmail(req.params.token);
    res.status(200).json({ message: 'Email was successfully verified!' });
  }
  // todo: validate permissions
  public static async remove(
    req: Request<UserFindParams>,
    res: Response<ResponseMessage>,
  ): Promise<void> {
    await UserService.removeUserByUsername(req.params.username);
    res.status(200).json({ message: 'User successfully deleted!' });
  }
}
