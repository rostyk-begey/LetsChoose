import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import jwt from 'jsonwebtoken';

import { AuthTokenPayload } from '@lets-choose/api/abstract';
import { JwtConfig } from '@lets-choose/api/config';
import { JwtService } from './jwt.service';

jest.mock('jsonwebtoken');
describe('JwtService', () => {
  let jwtService: JwtService;
  const jwtConfig: JwtConfig = {
    accessSecret: 'accessSecret',
    refreshSecret: 'refreshSecret',
    accessTokenKey: 'accessTokenKey',
    refreshTokenKey: 'refreshTokenKey',
    passwordResetSecret: 'passwordResetSecret',
    emailSecret: 'emailSecret',
  };
  const payload: AuthTokenPayload = {
    userId: 'userId',
    passwordVersion: 1,
  };
  const token = 'token';
  const configServiceGet = jest.fn((a, b) => jwtConfig);
  const configService: Partial<ConfigService> = {
    get: configServiceGet as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should get jwt config', () => {
    expect(configServiceGet.mock.calls[0][0]).toEqual('jwt');
  });

  test('generateAccessToken', () => {
    jwtService.generateAccessToken(payload);
    expect(jwt.sign).toHaveBeenCalledWith(payload, jwtConfig.accessSecret, {
      expiresIn: '15h',
    });
  });

  test('generateRefreshToken', () => {
    jwtService.generateRefreshToken(payload);
    expect(jwt.sign).toHaveBeenCalledWith(payload, jwtConfig.refreshSecret, {
      expiresIn: '7d',
    });
  });

  test('generateAuthTokenPair', () => {
    const spyGenerateAccessToken = jest
      .spyOn(jwtService, 'generateAccessToken')
      .mockReturnValue(token);
    const spyGenerateRefreshToken = jest
      .spyOn(jwtService, 'generateRefreshToken')
      .mockReturnValue(token);
    const result = jwtService.generateAuthTokenPair(
      payload.userId,
      payload.passwordVersion,
    );
    expect(spyGenerateAccessToken).toHaveBeenCalledWith(payload);
    expect(spyGenerateRefreshToken).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ accessToken: token, refreshToken: token });
  });

  test('generateResetPasswordToken', () => {
    jwtService.generateResetPasswordToken(payload.userId);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: payload.userId },
      jwtConfig.passwordResetSecret,
      {
        expiresIn: '10m',
      },
    );
  });

  test('generateEmailToken', () => {
    jwtService.generateEmailToken(payload.userId);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: payload.userId },
      jwtConfig.emailSecret,
      {},
    );
  });

  test('verifyAccessToken', () => {
    jwtService.verifyAccessToken(token);
    expect(jwt.verify).toHaveBeenCalledWith(token, jwtConfig.accessSecret);
  });

  test('verifyRefreshToken', () => {
    jwtService.verifyRefreshToken(token);
    expect(jwt.verify).toHaveBeenCalledWith(token, jwtConfig.refreshSecret);
  });

  test('verifyEmailToken', () => {
    jwtService.verifyEmailToken(token);
    expect(jwt.verify).toHaveBeenCalledWith(token, jwtConfig.emailSecret);
  });

  test('verifyPasswordResetToken', () => {
    jwtService.verifyPasswordResetToken(token);
    expect(jwt.verify).toHaveBeenCalledWith(
      token,
      jwtConfig.passwordResetSecret,
    );
  });
});
