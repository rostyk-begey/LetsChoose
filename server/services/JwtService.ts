import jwt from 'jsonwebtoken';
import { injectable } from 'inversify';

import config from '../config';

export interface BaseTokenPayload {
  userId: string;
}

export interface AuthTokenPayload extends BaseTokenPayload {
  passwordVersion: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IJwtService {
  generateAuthTokenPair(userId: string, passwordVersion: number): TokenPair;
  generateAccessToken(payload: AuthTokenPayload): string;
  generateRefreshToken(payload: AuthTokenPayload): string;
  generateResetPasswordToken(userId: string): string;
  generateEmailToken(userId: string): string;
  verifyAccessToken(token: string): AuthTokenPayload;
  verifyRefreshToken(token: string): AuthTokenPayload;
  verifyEmailToken(token: string): BaseTokenPayload;
  verifyPasswordResetToken(token: string): BaseTokenPayload;
}

@injectable()
export default class JwtService implements IJwtService {
  public generateAuthTokenPair(userId: string, passwordVersion = 0): TokenPair {
    const payload = { userId, passwordVersion };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  public generateAccessToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: '15s',
    });
  }

  public generateRefreshToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: '7d',
    });
  }

  public generateResetPasswordToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.passwordResetSecret, {
      expiresIn: '10m',
    });
  }

  public generateEmailToken(userId: string): string {
    return jwt.sign(
      { userId },
      config.jwt.emailSecret,
      {}, //{ expiresIn: '1d' }, // todo: check
    );
  }

  public verifyAccessToken(token: string): AuthTokenPayload {
    return jwt.verify(token, config.jwt.accessSecret) as AuthTokenPayload;
  }

  public verifyRefreshToken(token: string): AuthTokenPayload {
    return jwt.verify(token, config.jwt.refreshSecret) as AuthTokenPayload;
  }

  public verifyEmailToken(token: string): BaseTokenPayload {
    return jwt.verify(token, config.jwt.emailSecret) as BaseTokenPayload;
  }

  public verifyPasswordResetToken(token: string): BaseTokenPayload {
    return jwt.verify(
      token,
      config.jwt.passwordResetSecret,
    ) as BaseTokenPayload;
  }
}
