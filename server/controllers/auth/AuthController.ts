import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpPost,
  requestParam,
  results,
} from 'inversify-express-utils';

import { AppError } from '../../usecases/error';
import { LoginResponseBody, RequestWithTokenParam } from './types';
import { IAuthService } from '../../services/AuthService';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../../schema/auth';
import { TYPES } from '../../inversify.types';

@controller('/api/auth')
export default class AuthController extends BaseHttpController {
  constructor(
    @inject(TYPES.AuthService)
    protected readonly authService: IAuthService,
  ) {
    super();
  }

  @httpPost('/login', ...loginSchema)
  public async login(
    req: Request,
    res: Response<LoginResponseBody>,
  ): Promise<results.JsonResult> {
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
    } = await this.authService.loginUser(login, password);

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

    return this.json(responseBody, 200);
  }

  @httpPost('/register', ...registerSchema)
  public async register(req: Request): Promise<results.JsonResult> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect registration data', 400, {
        errors: errors.array(),
      });
    }

    const { email, username, password } = req.body;

    await this.authService.registerUser({ email, username, password });

    return this.json({ message: 'User successfully created!' }, 201);
  }

  @httpPost('/password/forgot', ...forgotPasswordSchema)
  public async forgotPassword(req: Request): Promise<results.JsonResult> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect email', 400, {
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    await this.authService.requestPasswordReset(email);

    return this.json(
      { message: `Reset password link has been sent to ${email}!` },
      201,
    );
  }

  @httpPost('/password/reset/:token', ...resetPasswordSchema)
  public async resetPassword(
    req: RequestWithTokenParam,
  ): Promise<results.JsonResult> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect data', 400, {
        errors: errors.array(),
      });
    }

    await this.authService.resetUsersPassword(
      req.params.token,
      req.body.password,
    );

    return this.json({ message: 'Password was successfully changed!' }, 201);
  }

  @httpPost('/token')
  public async refreshToken(
    req: Request,
    res: Response<LoginResponseBody>,
  ): Promise<results.JsonResult> {
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
    } = await this.authService.refreshToken(token);

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

    return this.json(responseBody, 200);
  }

  @httpPost('/email/confirm/:token')
  public async confirmEmail(
    @requestParam('token') token: string,
  ): Promise<results.JsonResult> {
    await this.authService.confirmEmail(token);
    return this.json({ message: 'Email was successfully verified!' }, 200);
  }
}
