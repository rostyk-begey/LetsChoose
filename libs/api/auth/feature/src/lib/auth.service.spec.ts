import { IAuthService } from '@lets-choose/api/abstract';
import {
  EmailService,
  JwtService,
  PasswordHashService,
} from '@lets-choose/api/common/services';
import { ApiConfigModule, loadConfig as config } from '@lets-choose/api/config';
import { userBuilder } from '@lets-choose/api/testing/builders';
import { User, UserRepository } from '@lets-choose/api/user/data-access';
import {
  AuthLoginDto,
  AuthTokenDto,
  UpdateUserPasswordDto,
} from '@lets-choose/common/dto';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import faker from 'faker';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import md5 from 'md5';
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { emailServiceMock } from '../../../../common/services/src/lib/email.service.mock';
import { jwtServiceMock } from '../../../../common/services/src/lib/jwt.service.mock';
import { passwordHashServiceMock } from '../../../../common/services/src/lib/password.service.mock';
import { userRepositoryMock } from '../../../../user/data-access/src/lib/user.repository.mock';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: IAuthService;
  let user: User;
  let tokenPair: AuthTokenDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApiConfigModule.register({ validateConfig: false })],
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

    authService = module.get<IAuthService>(AuthService);

    user = userBuilder();
    tokenPair = {
      userId: user.id,
      accessToken: faker.random.alphaNumeric(20),
      refreshToken: faker.random.alphaNumeric(20),
    };

    jest
      .spyOn(jwtServiceMock, 'generateAuthTokenPair')
      .mockImplementation(() => tokenPair);

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('registerUser', async () => {
    jest
      .spyOn(userRepositoryMock, 'findByEmail')
      .mockResolvedValueOnce(undefined);
    jest
      .spyOn(userRepositoryMock, 'findByUsername')
      .mockResolvedValueOnce(undefined);
    jest.spyOn(userRepositoryMock, 'createUser').mockResolvedValueOnce(user);

    const email = faker.internet.email();
    const username = faker.internet.userName();
    const password = faker.internet.password();

    await authService.registerUser({ email, username, password });

    expect(userRepositoryMock.createUser).toHaveBeenCalledWith({
      email,
      username,
      password,
      avatar: `https://www.gravatar.com/avatar/${md5(email)}?s=200&d=identicon`,
      bio: '',
    });
    expect(passwordHashServiceMock.hash).toHaveBeenCalledWith(password, 12);
    expect(jwtServiceMock.generateEmailToken).toHaveBeenCalledWith(user.id);
    expect(emailServiceMock.sendRegistrationEmail).toHaveBeenCalled();
  });

  describe('loginUser', () => {
    it('should login user by email correctly', async () => {
      const data: AuthLoginDto = {
        login: user.email,
        password: user.password,
      };
      userRepositoryMock.findByEmail.mockResolvedValueOnce(user);
      const result = await authService.loginUser(data);

      expect(result).toMatchObject(tokenPair);
      expect(userRepositoryMock.findByEmail).toBeCalledWith(data.login);
      expect(userRepositoryMock.findByUsername).not.toHaveBeenCalled();
      expect(jwtServiceMock.generateAuthTokenPair).toBeCalledWith(
        tokenPair.userId,
        user.passwordVersion,
      );
      expect(passwordHashServiceMock.compare).toBeCalledWith(
        user.password,
        user.password,
      );
    });

    it('should login user by username correctly', async () => {
      userRepositoryMock.findByEmail.mockResolvedValueOnce(undefined);
      userRepositoryMock.findByUsername.mockResolvedValueOnce(user);
      const data: AuthLoginDto = {
        login: user.username,
        password: user.password,
      };
      const result = await authService.loginUser(data);

      expect(result).toMatchObject(tokenPair);
      expect(userRepositoryMock.findByEmail).toBeCalledWith(data.login);
      expect(userRepositoryMock.findByUsername).toBeCalledWith(data.login);
      expect(jwtServiceMock.generateAuthTokenPair).toBeCalledWith(
        tokenPair.userId,
        user.passwordVersion,
      );
      expect(passwordHashServiceMock.compare).toBeCalledWith(
        user.password,
        user.password,
      );
    });

    it("should throw error if password didn't match", async () => {
      const data: AuthLoginDto = {
        login: user.username,
        password: faker.internet.password(),
      };
      userRepositoryMock.findByEmail.mockResolvedValueOnce(user);

      expect.assertions(4);

      try {
        await authService.loginUser(data);
      } catch (e) {
        expect(e.message).toMatch('Incorrect login data');
      }

      expect(userRepositoryMock.findByEmail).toBeCalledWith(data.login);
      expect(userRepositoryMock.findByUsername).not.toBeCalledWith(data.login);
      expect(passwordHashServiceMock.compare).toBeCalledWith(
        data.password,
        user.password,
      );
    });

    it('should throw error if login is incorrect', async () => {
      userRepositoryMock.findByEmail.mockResolvedValueOnce(undefined);
      userRepositoryMock.findByUsername.mockResolvedValueOnce(undefined);
      expect.assertions(1);
      try {
        await authService.loginUser({
          login: 'incorrect',
          password: user.password,
        });
      } catch (e) {
        expect(e.message).toMatch('User not exists!');
      }
    });
  });

  describe('loginUserOAuth', () => {
    const idToken = faker.random.alphaNumeric(20);
    const tokenPayload: TokenPayload = {
      iss: 'iss',
      sub: 'sub',
      aud: 'aud',
      iat: 10,
      exp: 20,
      email: faker.internet.email(),
      picture: faker.internet.avatar(),
    };
    const ticket = { getPayload: jest.fn().mockReturnValue(tokenPayload) };
    const getTokenSpy = jest
      .spyOn(OAuth2Client.prototype, 'getToken')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockResolvedValueOnce({
        tokens: { id_token: idToken },
        res: null,
      } as GetTokenResponse);
    const verifyIdTokenSpy = jest
      .spyOn(OAuth2Client.prototype, 'verifyIdToken')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockResolvedValueOnce(ticket);

    it('should login user correctly from token', async () => {
      userRepositoryMock.findByEmail.mockResolvedValueOnce(user);
      const result = await authService.loginUserOAuth({ token: idToken });

      expect(result).toMatchObject({ ...tokenPair, userId: user.id });
      expect(getTokenSpy).not.toBeCalled();
      expect(verifyIdTokenSpy).toBeCalledWith({
        idToken,
        audience: config().googleOAuth.clientId,
      });
      expect(ticket.getPayload).toBeCalled();
      expect(userRepositoryMock.findByEmail).toBeCalledWith(tokenPayload.email);
      expect(jwtServiceMock.generateAuthTokenPair).toBeCalledWith(
        tokenPair.userId,
        user.passwordVersion,
      );
    });
  });

  describe('requestPasswordReset', () => {
    it('should reset password correctly', async () => {
      userRepositoryMock.findByEmail.mockResolvedValueOnce(user);
      const email = faker.internet.email();

      await authService.requestPasswordReset({ email });

      expect(userRepositoryMock.findByEmail).toBeCalledWith(email);
      expect(jwtServiceMock.generateResetPasswordToken).toBeCalledWith(user.id);
      expect(emailServiceMock.sendResetPasswordEmail).toBeCalled();
    });

    it("should throw error if user doesn't exists", async () => {
      userRepositoryMock.findByEmail.mockResolvedValueOnce(undefined);
      expect.assertions(2);

      const email = faker.internet.email();

      try {
        await authService.requestPasswordReset({ email });
      } catch (e) {
        expect(userRepositoryMock.findByEmail).toBeCalledWith(email);
        expect(e.message).toEqual('User not found');
      }
    });
  });

  describe('resetUsersPassword', () => {
    const newPassword = faker.internet.password();
    const mockToken = faker.lorem.word();

    it('should reset user password', async () => {
      userRepositoryMock.findByIdOrFail.mockResolvedValueOnce(user);
      jwtServiceMock.verifyPasswordResetToken.mockImplementationOnce(() => ({
        userId: user.id,
      }));

      await authService.resetUsersPassword(mockToken, newPassword);

      expect(jwtServiceMock.verifyPasswordResetToken).toBeCalledWith(mockToken);
      expect(passwordHashServiceMock.hash).toBeCalledWith(newPassword, 12);
      expect(userRepositoryMock.findByIdAndUpdate).toHaveBeenCalledWith(
        user.id,
        {
          password: newPassword,
          passwordVersion: user.passwordVersion + 1,
        },
      );
    });

    it('should throw error if token is invalid', async () => {
      jwtServiceMock.verifyPasswordResetToken.mockImplementationOnce(() => {
        throw new Error();
      });

      expect.assertions(1);

      try {
        await authService.resetUsersPassword(mockToken, newPassword);
      } catch (e) {
        expect(e.message).toEqual('Reset password link expired');
      }
    });
  });

  describe('refreshToken', () => {
    const mockToken = faker.lorem.word();

    it('should refresh token correctly', async () => {
      userRepositoryMock.findByIdOrFail.mockResolvedValueOnce(user);
      jwtServiceMock.verifyRefreshToken.mockImplementationOnce(() => ({
        userId: user.id,
        passwordVersion: user.passwordVersion,
      }));
      jwtServiceMock.generateAuthTokenPair.mockImplementation(() => tokenPair);

      const result = await authService.refreshToken(mockToken);

      expect(result).toMatchObject(tokenPair);
      expect(userRepositoryMock.findByIdOrFail).toBeCalledWith(user.id);
      expect(jwtServiceMock.generateAuthTokenPair).toBeCalledWith(
        user.id,
        user.passwordVersion,
      );
    });

    it('should throw error if token is incorrect', async () => {
      jest
        .spyOn(jwtServiceMock, 'verifyRefreshToken')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      expect.assertions(1);

      try {
        await authService.refreshToken(mockToken);
      } catch (e) {
        expect(e.message).toEqual('Unauthorized');
      }
    });
  });

  describe('updateUsersPassword', () => {
    let newPassword: string;
    let newPasswordVersion: number;

    beforeEach(() => {
      newPasswordVersion = user.passwordVersion + 1;
      newPassword = faker.random.alphaNumeric(8);
    });

    it('should login user by username correctly', async () => {
      userRepositoryMock.findByEmail.mockResolvedValueOnce(undefined);
      userRepositoryMock.findByIdOrFail.mockResolvedValueOnce(user);
      const password = user.password;
      const data: UpdateUserPasswordDto = {
        password,
        newPassword,
      };
      const result = await authService.updateUsersPassword(user.id, data);

      expect(result).toMatchObject(tokenPair);
      expect(userRepositoryMock.findByIdOrFail).toBeCalledWith(user.id);
      expect(passwordHashServiceMock.compare).toBeCalledWith(
        password,
        user.password,
      );
      expect(passwordHashServiceMock.hash).toBeCalledWith(newPassword, 12);
      expect(userRepositoryMock.findByIdAndUpdate).toBeCalledWith(
        user.id,
        expect.objectContaining({
          password: newPassword,
          passwordVersion: newPasswordVersion,
        }),
      );
      expect(jwtServiceMock.generateAuthTokenPair).toBeCalledWith(
        tokenPair.userId,
        newPasswordVersion,
      );
    });

    it("should throw error if password didn't match", async () => {
      const password = faker.random.alphaNumeric(8);
      const data: UpdateUserPasswordDto = {
        password,
        newPassword,
      };
      userRepositoryMock.findByIdOrFail.mockResolvedValueOnce(user);

      expect.assertions(7);

      try {
        await authService.updateUsersPassword(user.id, data);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toMatch('Incorrect password');
      }

      expect(userRepositoryMock.findByIdOrFail).toBeCalledWith(user.id);
      expect(passwordHashServiceMock.compare).toBeCalledWith(
        password,
        user.password,
      );
      expect(passwordHashServiceMock.hash).not.toBeCalled();
      expect(userRepositoryMock.findByIdAndUpdate).not.toBeCalled();
      expect(jwtServiceMock.generateAuthTokenPair).not.toBeCalled();
    });
  });

  describe('confirmEmail', () => {
    const mockToken = faker.lorem.word();

    it('should confirm email correctly', async () => {
      jest
        .spyOn(jwtServiceMock, 'verifyEmailToken')
        .mockImplementationOnce(() => ({ userId: user.id }));

      await authService.confirmEmail(mockToken);

      expect(jwtServiceMock.verifyEmailToken).toBeCalledWith(mockToken);
      expect(userRepositoryMock.findByIdAndUpdate).toBeCalledWith(user.id, {
        confirmed: true,
      });
    });

    it('should throw error if token is incorrect', async () => {
      jest
        .spyOn(jwtServiceMock, 'verifyEmailToken')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      expect.assertions(1);

      try {
        await authService.confirmEmail(mockToken);
      } catch (e) {
        expect(e.message).toEqual('Invalid url');
      }
    });
  });
});
