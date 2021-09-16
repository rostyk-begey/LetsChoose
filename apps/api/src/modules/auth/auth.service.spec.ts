import {
  AuthLoginDto,
  AuthTokenDto,
  UpdateUserPasswordDto,
} from '@lets-choose/common/dto';
import { EmailService } from '@modules/common/email/email.service';
import { JwtService } from '@modules/common/jwt/jwt.service';
import { UserRepository } from '../../../../../libs/api/user/data-access/src/lib/user.repository';
import { User } from '../../../../../libs/api/user/data-access/src/lib/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import faker from 'faker';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';

import { IAuthService } from '@abstract/auth.service.interface';
import jwtService from '@modules/common/jwt/__mocks__/jwt.service';
import emailService from '@modules/common/email/__mocks__/email.service';
import passwordHashService from '@modules/common/password/__mocks__/password.service';
import userRepository, {
  userBuilder,
} from '@modules/user/__mocks__/user.repository';
import config from '@src/config';
import { TYPES } from '@src/injectable.types';
import { AuthService } from '@modules/auth/auth.service';
import md5 from 'md5';
import { PasswordHashService } from '@modules/common/password/password.service';

describe('AuthService', () => {
  let authService: IAuthService;
  let user: User;
  let tokenPair: AuthTokenDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          useValue: userRepository,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: EmailService,
          useValue: emailService,
        },
        {
          provide: PasswordHashService,
          useValue: passwordHashService,
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
      .spyOn(jwtService, 'generateAuthTokenPair')
      .mockImplementation(() => tokenPair);

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('registerUser', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(undefined);
    jest
      .spyOn(userRepository, 'findByUsername')
      .mockResolvedValueOnce(undefined);
    jest.spyOn(userRepository, 'createUser').mockResolvedValueOnce(user);

    const email = faker.internet.email();
    const username = faker.internet.userName();
    const password = faker.internet.password();

    await authService.registerUser({ email, username, password });

    expect(userRepository.createUser).toHaveBeenCalledWith({
      email,
      username,
      password,
      avatar: `https://www.gravatar.com/avatar/${md5(email)}?s=200&d=identicon`,
      bio: '',
    });
    expect(passwordHashService.hash).toHaveBeenCalledWith(password, 12);
    expect(jwtService.generateEmailToken).toHaveBeenCalledWith(user.id);
    expect(emailService.sendRegistrationEmail).toHaveBeenCalled();
  });

  describe('loginUser', () => {
    it('should login user by email correctly', async () => {
      const data: AuthLoginDto = {
        login: user.email,
        password: user.password,
      };
      userRepository.findByEmail.mockResolvedValueOnce(user);
      const result = await authService.loginUser(data);

      expect(result).toMatchObject(tokenPair);
      expect(userRepository.findByEmail).toBeCalledWith(data.login);
      expect(userRepository.findByUsername).not.toHaveBeenCalled();
      expect(jwtService.generateAuthTokenPair).toBeCalledWith(
        tokenPair.userId,
        user.passwordVersion,
      );
      expect(passwordHashService.compare).toBeCalledWith(
        user.password,
        user.password,
      );
    });

    it('should login user by username correctly', async () => {
      userRepository.findByEmail.mockResolvedValueOnce(undefined);
      userRepository.findByUsername.mockResolvedValueOnce(user);
      const data: AuthLoginDto = {
        login: user.username,
        password: user.password,
      };
      const result = await authService.loginUser(data);

      expect(result).toMatchObject(tokenPair);
      expect(userRepository.findByEmail).toBeCalledWith(data.login);
      expect(userRepository.findByUsername).toBeCalledWith(data.login);
      expect(jwtService.generateAuthTokenPair).toBeCalledWith(
        tokenPair.userId,
        user.passwordVersion,
      );
      expect(passwordHashService.compare).toBeCalledWith(
        user.password,
        user.password,
      );
    });

    it("should throw error if password didn't match", async () => {
      const data: AuthLoginDto = {
        login: user.username,
        password: faker.internet.password(),
      };
      userRepository.findByEmail.mockResolvedValueOnce(user);

      expect.assertions(4);

      try {
        await authService.loginUser(data);
      } catch (e) {
        expect(e.message).toMatch('Incorrect login data');
      }

      expect(userRepository.findByEmail).toBeCalledWith(data.login);
      expect(userRepository.findByUsername).not.toBeCalledWith(data.login);
      expect(passwordHashService.compare).toBeCalledWith(
        data.password,
        user.password,
      );
    });

    it('should throw error if login is incorrect', async () => {
      userRepository.findByEmail.mockResolvedValueOnce(undefined);
      userRepository.findByUsername.mockResolvedValueOnce(undefined);
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
      userRepository.findByEmail.mockResolvedValueOnce(user);
      const result = await authService.loginUserOAuth({ token: idToken });

      expect(result).toMatchObject({ ...tokenPair, userId: user.id });
      expect(getTokenSpy).not.toBeCalled();
      expect(verifyIdTokenSpy).toBeCalledWith({
        idToken,
        audience: config().googleOAuth.clientId,
      });
      expect(ticket.getPayload).toBeCalled();
      expect(userRepository.findByEmail).toBeCalledWith(tokenPayload.email);
      expect(jwtService.generateAuthTokenPair).toBeCalledWith(
        tokenPair.userId,
        user.passwordVersion,
      );
    });
  });

  describe('requestPasswordReset', () => {
    it('should reset password correctly', async () => {
      userRepository.findByEmail.mockResolvedValueOnce(user);
      const email = faker.internet.email();

      await authService.requestPasswordReset({ email });

      expect(userRepository.findByEmail).toBeCalledWith(email);
      expect(jwtService.generateResetPasswordToken).toBeCalledWith(user.id);
      expect(emailService.sendResetPasswordEmail).toBeCalled();
    });

    it("should throw error if user doesn't exists", async () => {
      userRepository.findByEmail.mockResolvedValueOnce(undefined);
      expect.assertions(2);

      const email = faker.internet.email();

      try {
        await authService.requestPasswordReset({ email });
      } catch (e) {
        expect(userRepository.findByEmail).toBeCalledWith(email);
        expect(e.message).toEqual('User not found');
      }
    });
  });

  describe('resetUsersPassword', () => {
    const newPassword = faker.internet.password();
    const mockToken = faker.lorem.word();

    it('should reset user password', async () => {
      userRepository.findByIdOrFail.mockResolvedValueOnce(user);
      jwtService.verifyPasswordResetToken.mockImplementationOnce(() => ({
        userId: user.id,
      }));

      await authService.resetUsersPassword(mockToken, newPassword);

      expect(jwtService.verifyPasswordResetToken).toBeCalledWith(mockToken);
      expect(passwordHashService.hash).toBeCalledWith(newPassword, 12);
      expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(user.id, {
        password: newPassword,
        passwordVersion: user.passwordVersion + 1,
      });
    });

    it('should throw error if token is invalid', async () => {
      jwtService.verifyPasswordResetToken.mockImplementationOnce(() => {
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
      userRepository.findByIdOrFail.mockResolvedValueOnce(user);
      jwtService.verifyRefreshToken.mockImplementationOnce(() => ({
        userId: user.id,
        passwordVersion: user.passwordVersion,
      }));
      jwtService.generateAuthTokenPair.mockImplementation(() => tokenPair);

      const result = await authService.refreshToken(mockToken);

      expect(result).toMatchObject(tokenPair);
      expect(userRepository.findByIdOrFail).toBeCalledWith(user.id);
      expect(jwtService.generateAuthTokenPair).toBeCalledWith(
        user.id,
        user.passwordVersion,
      );
    });

    it('should throw error if token is incorrect', async () => {
      jest
        .spyOn(jwtService, 'verifyRefreshToken')
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
      userRepository.findByEmail.mockResolvedValueOnce(undefined);
      userRepository.findByIdOrFail.mockResolvedValueOnce(user);
      const password = user.password;
      const data: UpdateUserPasswordDto = {
        password,
        newPassword,
      };
      const result = await authService.updateUsersPassword(user.id, data);

      expect(result).toMatchObject(tokenPair);
      expect(userRepository.findByIdOrFail).toBeCalledWith(user.id);
      expect(passwordHashService.compare).toBeCalledWith(
        password,
        user.password,
      );
      expect(passwordHashService.hash).toBeCalledWith(newPassword, 12);
      expect(userRepository.findByIdAndUpdate).toBeCalledWith(
        user.id,
        expect.objectContaining({
          password: newPassword,
          passwordVersion: newPasswordVersion,
        }),
      );
      expect(jwtService.generateAuthTokenPair).toBeCalledWith(
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
      userRepository.findByIdOrFail.mockResolvedValueOnce(user);

      expect.assertions(7);

      try {
        await authService.updateUsersPassword(user.id, data);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toMatch('Incorrect password');
      }

      expect(userRepository.findByIdOrFail).toBeCalledWith(user.id);
      expect(passwordHashService.compare).toBeCalledWith(
        password,
        user.password,
      );
      expect(passwordHashService.hash).not.toBeCalled();
      expect(userRepository.findByIdAndUpdate).not.toBeCalled();
      expect(jwtService.generateAuthTokenPair).not.toBeCalled();
    });
  });

  describe('confirmEmail', () => {
    const mockToken = faker.lorem.word();

    it('should confirm email correctly', async () => {
      jest
        .spyOn(jwtService, 'verifyEmailToken')
        .mockImplementationOnce(() => ({ userId: user.id }));

      await authService.confirmEmail(mockToken);

      expect(jwtService.verifyEmailToken).toBeCalledWith(mockToken);
      expect(userRepository.findByIdAndUpdate).toBeCalledWith(user.id, {
        confirmed: true,
      });
    });

    it('should throw error if token is incorrect', async () => {
      jest.spyOn(jwtService, 'verifyEmailToken').mockImplementationOnce(() => {
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
