import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

import { JwtConfig } from '../../../config';
import {
  AuthTokenPayload,
  BaseTokenPayload,
  IJwtService,
  TokenPair,
} from '../../../abstract/jwt.service.interface';

@Injectable()
export class JwtService implements IJwtService {
  private readonly config: JwtConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = configService.get<JwtConfig>('jwt');
  }

  public generateAuthTokenPair(userId: string, passwordVersion = 0): TokenPair {
    const payload = { userId, passwordVersion };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  public generateAccessToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, this.config.accessSecret, {
      expiresIn: '15h',
    });
  }

  public generateRefreshToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, this.config.refreshSecret, {
      expiresIn: '7d',
    });
  }

  public generateResetPasswordToken(userId: string): string {
    return jwt.sign({ userId }, this.config.passwordResetSecret, {
      expiresIn: '10m',
    });
  }

  public generateEmailToken(userId: string): string {
    return jwt.sign(
      { userId },
      this.config.emailSecret,
      {}, //{ expiresIn: '1d' }, // todo: check
    );
  }

  public verifyAccessToken(token: string): AuthTokenPayload {
    return jwt.verify(token, this.config.accessSecret) as AuthTokenPayload;
  }

  public verifyRefreshToken(token: string): AuthTokenPayload {
    return jwt.verify(token, this.config.refreshSecret) as AuthTokenPayload;
  }

  public verifyEmailToken(token: string): BaseTokenPayload {
    return jwt.verify(token, this.config.emailSecret) as BaseTokenPayload;
  }

  public verifyPasswordResetToken(token: string): BaseTokenPayload {
    return jwt.verify(
      token,
      this.config.passwordResetSecret,
    ) as BaseTokenPayload;
  }
}
