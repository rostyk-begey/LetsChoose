import * as jwt from 'jsonwebtoken';
import {
  TokenPair,
  IJwtService,
  AuthTokenPayload,
  BaseTokenPayload,
} from '../../../src/abstract/jwt.service.interface';
// import config from '../../../config';
// import {
//   AuthTokenPayload,
//   BaseTokenPayload,
//   IJwtService,
//   TokenPair,
// } from '../../../services/JwtService';

const JwtService: IJwtService = {
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
    // return jwt.verify(token, config.jwt.accessSecret) as AuthTokenPayload;
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

JwtService.generateAuthTokenPair = jest.fn(JwtService.generateAuthTokenPair);
JwtService.generateAccessToken = jest.fn(JwtService.generateAccessToken);
JwtService.generateRefreshToken = jest.fn(JwtService.generateRefreshToken);
JwtService.generateResetPasswordToken = jest.fn(
  JwtService.generateResetPasswordToken,
);
JwtService.generateEmailToken = jest.fn(JwtService.generateEmailToken);
JwtService.verifyAccessToken = jest.fn(JwtService.verifyAccessToken);
JwtService.verifyRefreshToken = jest.fn(JwtService.verifyRefreshToken);
JwtService.verifyEmailToken = jest.fn(JwtService.verifyEmailToken);
JwtService.verifyPasswordResetToken = jest.fn(
  JwtService.verifyPasswordResetToken,
);

export default JwtService;
