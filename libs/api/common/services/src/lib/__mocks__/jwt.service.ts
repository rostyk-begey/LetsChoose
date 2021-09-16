import {
  TokenPair,
  IJwtService,
  AuthTokenPayload,
  BaseTokenPayload,
} from '@abstract/jwt.service.interface';

const jwtService: IJwtService = {
  generateAuthTokenPair(userId: string, passwordVersion = 0): TokenPair {
    const payload = { userId, passwordVersion };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  },

  generateAccessToken(payload: AuthTokenPayload): string {
    return JSON.stringify(payload);
  },

  generateRefreshToken(payload: AuthTokenPayload): string {
    return JSON.stringify(payload);
  },

  generateResetPasswordToken(userId: string): string {
    return JSON.stringify({ userId });
  },

  generateEmailToken(userId: string): string {
    return JSON.stringify({ userId });
  },

  verifyAccessToken(token: string): AuthTokenPayload {
    return JSON.parse(token) as AuthTokenPayload;
  },

  verifyRefreshToken(token: string): AuthTokenPayload {
    return JSON.parse(token) as AuthTokenPayload;
  },

  verifyEmailToken(token: string): BaseTokenPayload {
    return JSON.parse(token) as BaseTokenPayload;
  },

  verifyPasswordResetToken(token: string): BaseTokenPayload {
    return JSON.parse(token) as BaseTokenPayload;
  },
};

jwtService.generateAuthTokenPair = jest.fn(jwtService.generateAuthTokenPair);
jwtService.generateAccessToken = jest.fn(jwtService.generateAccessToken);
jwtService.generateRefreshToken = jest.fn(jwtService.generateRefreshToken);
jwtService.generateResetPasswordToken = jest.fn(
  jwtService.generateResetPasswordToken,
);
jwtService.generateEmailToken = jest.fn(jwtService.generateEmailToken);
jwtService.verifyAccessToken = jest.fn(jwtService.verifyAccessToken);
jwtService.verifyRefreshToken = jest.fn(jwtService.verifyRefreshToken);
jwtService.verifyEmailToken = jest.fn(jwtService.verifyEmailToken);
jwtService.verifyPasswordResetToken = jest.fn(
  jwtService.verifyPasswordResetToken,
);

export default jwtService as jest.Mocked<IJwtService>;
