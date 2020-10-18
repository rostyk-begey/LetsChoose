import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import autobind from 'autobind-decorator';
import { inject, injectable } from 'inversify';

import { AppError } from '../../usecases/error';
import {
  UserFindParams,
  LoginResponseBody,
  RequestWithTokenParam,
} from './types';
import UserService, { IUserService } from '../../services/UserService';
import { RequestWithUserId, ResponseMessage } from '../../types';
import { User } from '../../models/User';

@autobind
@injectable()
export default class UserController {
  private readonly userService: IUserService;

  constructor(
    @inject(UserService)
    userService: IUserService,
  ) {
    this.userService = userService;
  }

  public async login(
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

    const {
      userId,
      accessToken,
      refreshToken,
    } = await this.userService.loginUser(login, password);

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

  public async register(
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

    await this.userService.registerUser({ email, username, password });

    res.status(201).json({ message: 'User successfully created!' });
  }

  public async forgotPassword(
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

    await this.userService.requestPasswordReset(email);

    res
      .status(201)
      .json({ message: `Reset password link has been sent to ${email}!` });
  }

  public async resetPassword(
    req: RequestWithTokenParam,
    res: Response<ResponseMessage>,
  ): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect data', 400, {
        errors: errors.array(),
      });
    }

    await this.userService.resetUsersPassword(
      req.params.token,
      req.body.password,
    );

    res.status(201).json({ message: 'Password was successfully changed!' });
  }

  public async refreshToken(
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
    } = await this.userService.refreshToken(token);

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

  public async find(
    req: RequestWithUserId<UserFindParams>,
    res: Response<User>,
  ): Promise<void> {
    const user = await this.userService.findByUsernameOrReturnCurrentUser(
      req.params.username,
      req.userId,
    );
    res.status(200).json(user);
  }

  public async confirmEmail(
    req: RequestWithTokenParam,
    res: Response<ResponseMessage>,
  ): Promise<void> {
    await this.userService.confirmEmail(req.params.token);
    res.status(200).json({ message: 'Email was successfully verified!' });
  }

  // todo: validate permissions
  public async remove(
    req: Request<UserFindParams>,
    res: Response<ResponseMessage>,
  ): Promise<void> {
    await this.userService.removeUserByUsername(req.params.username);
    res.status(200).json({ message: 'User successfully deleted!' });
  }
}
