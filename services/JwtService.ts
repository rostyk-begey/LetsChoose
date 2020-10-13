import jwt from 'jsonwebtoken';
import config from 'config';

interface BaseTokenPayload {
  userId: string;
}

interface AuthTokenPayload extends BaseTokenPayload {
  passwordVersion: number;
}

export default class JwtService {
  public static generateAccessToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, config.get('jwt.accessSecret'), {
      expiresIn: '15s',
    });
  }

  public static generateRefreshToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, config.get('jwt.refreshSecret'), {
      expiresIn: '7d',
    });
  }

  public static generateResetPasswordToken(userId: string): string {
    return jwt.sign({ userId }, config.get('jwt.passwordResetSecret'), {
      expiresIn: '10m',
    });
  }

  public static generateEmailToken(userId: string): string {
    return jwt.sign(
      { userId },
      config.get('jwt.emailSecret'),
      {}, //{ expiresIn: '1d' }, // todo: check
    );
  }

  public static verifyAccessToken(token: string): AuthTokenPayload {
    return jwt.verify(
      token,
      config.get('jwt.accessSecret'),
    ) as AuthTokenPayload;
  }

  public static verifyRefreshToken(token: string): AuthTokenPayload {
    return jwt.verify(
      token,
      config.get('jwt.refreshSecret'),
    ) as AuthTokenPayload;
  }

  public static verifyEmailToken(token: string): BaseTokenPayload {
    return jwt.verify(token, config.get('jwt.emailSecret')) as BaseTokenPayload;
  }

  public static verifyPasswordResetToken(token: string): BaseTokenPayload {
    return jwt.verify(
      token,
      config.get('jwt.passwordResetSecret'),
    ) as BaseTokenPayload;
  }
}
