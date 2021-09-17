import { IAuthService } from '@lets-choose/api/abstract';
import {
  EmailService,
  JwtService,
  PasswordHashService,
} from '@lets-choose/api/common/services';
import { loadConfig as config } from '@lets-choose/api/config';
import { userBuilder } from '@lets-choose/api/testing/builders';
import { User, UserRepository } from '@lets-choose/api/user/data-access';
import {
  AuthForgotPasswordDto,
  AuthGoogleLoginDto,
  AuthLoginDto,
  AuthRegisterDto,
  AuthTokenDto,
  UpdateUserPasswordDto,
} from '@lets-choose/common/dto';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { emailServiceMock } from '../../../../common/services/src/lib/email.service.mock';
import { jwtServiceMock } from '../../../../common/services/src/lib/jwt.service.mock';
import { passwordHashServiceMock } from '../../../../common/services/src/lib/password.service.mock';
import { userRepositoryMock } from '../../../../user/data-access/src/lib/user.repository.mock';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: IAuthService;
  const { jwt: mockJwtConfig } = config();
  let mockRequest;
  let mockResponse;
  let user: User;
  let mockAuthTokenDto: AuthTokenDto;
  const cookieOptions = {
    httpOnly: true,
    secure: false,
    path: '/',
    sameSite: 'lax',
  };

  const expectValidCookie = (callIndex) => {
    expect(mockResponse.cookie.mock.calls[callIndex][0]).toEqual(
      callIndex === 0
        ? mockJwtConfig.accessTokenKey
        : mockJwtConfig.refreshTokenKey,
    );
    expect(mockResponse.cookie.mock.calls[callIndex][1]).toEqual(
      callIndex === 0
        ? mockAuthTokenDto.accessToken
        : mockAuthTokenDto.refreshToken,
    );
    expect(mockResponse.cookie.mock.calls[callIndex][2]).toMatchObject(
      cookieOptions,
    );
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [config],
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: EmailService,
          useValue: emailServiceMock,
        },
        {
          provide: PasswordHashService,
          useValue: passwordHashServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    authService = module.get<IAuthService>(AuthService);

    user = userBuilder();
    mockAuthTokenDto = {
      userId: user.id,
      accessToken: faker.random.alphaNumeric(20),
      refreshToken: faker.random.alphaNumeric(20),
    };

    mockRequest = {
      user,
    };

    mockResponse = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    jest
      .spyOn(authService, 'loginUser')
      .mockResolvedValueOnce(mockAuthTokenDto);
    jest
      .spyOn(authService, 'loginUserOAuth')
      .mockResolvedValueOnce(mockAuthTokenDto);
    jest
      .spyOn(authService, 'refreshToken')
      .mockResolvedValueOnce(mockAuthTokenDto);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockResponse.cookie.mockRestore();
  });

  describe('login', () => {
    it('should login user correctly', async () => {
      const dto: AuthLoginDto = {
        login: faker.internet.userName(),
        password: faker.internet.password(),
      };

      const result = await controller.login(mockResponse, dto);

      expect(result).toMatchObject(mockAuthTokenDto);

      expectValidCookie(0);
      expectValidCookie(1);

      expect(authService.loginUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('loginGoogle', () => {
    it('should login user by token correctly', async () => {
      const dto: AuthGoogleLoginDto = { token: faker.lorem.word() };
      const result = await controller.loginGoogle(mockResponse, dto);

      expect(result).toMatchObject(mockAuthTokenDto);

      expectValidCookie(0);
      expectValidCookie(1);

      expect(authService.loginUserOAuth).toHaveBeenCalledWith(dto);
    });
  });

  describe('logout', () => {
    it('should logout user correctly', async () => {
      const { message } = await controller.logout(mockResponse);

      expect(mockResponse.clearCookie.mock.calls[0][0]).toEqual(
        mockJwtConfig.accessTokenKey,
      );
      expect(mockResponse.clearCookie.mock.calls[1][0]).toEqual(
        mockJwtConfig.refreshTokenKey,
      );

      expect(message).toEqual('You have been logged out');
    });
  });

  describe('register', () => {
    it('should register and login user correctly', async () => {
      jest.spyOn(authService, 'registerUser').mockResolvedValueOnce(undefined);

      const dto: AuthRegisterDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };

      const result = await controller.register(mockResponse, dto);

      expect(result).toMatchObject(mockAuthTokenDto);

      expectValidCookie(0);
      expectValidCookie(1);

      expect(authService.registerUser).toHaveBeenCalledWith(dto);
      expect(authService.loginUser).toHaveBeenCalledWith({
        login: dto.username,
        password: dto.password,
      });
    });
  });

  describe('forgotPassword', () => {
    it('should request reset password correctly', async () => {
      const dto: AuthForgotPasswordDto = { email: faker.internet.email() };
      const expectedMessage = `Reset password link has been sent to ${dto.email}!`;
      jest
        .spyOn(authService, 'requestPasswordReset')
        .mockImplementation(() => null);
      const { message } = await controller.forgotPassword(dto);

      expect(authService.requestPasswordReset).toHaveBeenCalledWith(dto);
      expect(message).toEqual(expectedMessage);
    });
  });

  describe('resetPassword', () => {
    it('should request reset password correctly', async () => {
      const token = faker.lorem.word();
      const password = faker.internet.password();
      jest
        .spyOn(authService, 'resetUsersPassword')
        .mockResolvedValueOnce(undefined);

      const { message } = await controller.resetPassword(token, { password });

      expect(authService.resetUsersPassword).toHaveBeenCalledWith(
        token,
        password,
      );
      expect(message).toEqual('Password was successfully changed!');
    });
  });

  describe('updatePassword', () => {
    it("should update user's password correctly", async () => {
      jest
        .spyOn(authService, 'updateUsersPassword')
        .mockResolvedValueOnce(mockAuthTokenDto);

      const dto: UpdateUserPasswordDto = {
        password: faker.internet.password(),
        newPassword: faker.internet.password(),
      };

      const result = await controller.updatePassword(
        mockRequest,
        mockResponse,
        dto,
      );

      expect(result).toMatchObject(mockAuthTokenDto);

      expectValidCookie(0);
      expectValidCookie(1);

      expect(authService.updateUsersPassword).toHaveBeenCalledWith(
        user.id,
        dto,
      );
    });
  });

  describe('refreshToken', () => {
    const req = {
      body: { refreshToken: 'body.refreshToken' },
      cookies: { refreshToken: 'cookies.refreshToken' },
    };
    it.each`
      refreshTokenLocation
      ${'body'}
      ${'cookies'}
    `('should refresh token correctly', async ({ refreshTokenLocation }) => {
      const result = await controller.refreshToken(
        req,
        mockResponse,
        refreshTokenLocation,
      );

      expect(authService.refreshToken).toHaveBeenCalledWith(
        req[refreshTokenLocation].refreshToken,
      );
      expectValidCookie(0);
      expectValidCookie(1);

      expect(result.userId).toEqual(mockAuthTokenDto.userId);
      expect(result.accessToken).toEqual(mockAuthTokenDto.accessToken);
      expect(result.refreshToken).toEqual(
        refreshTokenLocation === 'body'
          ? mockAuthTokenDto.refreshToken
          : undefined,
      );
    });
  });

  describe('confirmEmail', () => {
    it('should confirm email correctly', async () => {
      const token = 'token';
      jest.spyOn(authService, 'confirmEmail').mockResolvedValueOnce(undefined);

      const { message } = await controller.confirmEmail(token);

      expect(authService.confirmEmail).toHaveBeenCalledWith(token);
      expect(message).toEqual('Email was successfully verified!');
    });
  });
});
