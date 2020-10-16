import jwt from 'jsonwebtoken';

import config from '../config';

interface BaseTokenPayload {
  userId: string;
}

interface AuthTokenPayload extends BaseTokenPayload {
  passwordVersion: number;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export default class JwtService {
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
