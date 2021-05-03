import { AuthLoginDto, AuthTokenDto, CreateUserDto } from '@lets-choose/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IAuthService } from '../../abstract/auth.service.interface';

import jwtService from '../common/jwt/__mocks__/jwt.service';
import emailService from '../common/email/__mocks__/email.service';
import passwordHashService from '../common/password/__mocks__/password.service';
import userRepository, { user } from '../user/__mocks__/user.repository';
import config from '../../config';
import { TYPES } from '../../injectable.types';
import { PasswordHashService } from '../common/password/password.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: IAuthService;
  const { username, password, email } = user;
  const tokenPair: AuthTokenDto = {
    userId: user.id,
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  };

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
        PasswordHashService,
        {
          provide: TYPES.UserRepository,
          useValue: userRepository,
        },
        {
          provide: TYPES.JwtService,
          useValue: jwtService,
        },
        {
          provide: TYPES.EmailService,
          useValue: emailService,
        },
        {
          provide: TYPES.PasswordHashService,
          useValue: passwordHashService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  test('registerUser', async () => {
    const userId = 'userId';
    jest
      .spyOn(userRepository, 'createUser')
      .mockImplementationOnce((data: CreateUserDto) => ({
        ...userRepository.createUser(data),
        id: userId,
        _id: userId,
      }));

    await authService.registerUser({ email, username, password });

    expect(userRepository.createUser).toHaveBeenCalled();
    expect(passwordHashService.hash).toHaveBeenCalledWith(password, 12);
    expect(jwtService.generateEmailToken).toHaveBeenCalledWith(userId);
    expect(emailService.sendRegistrationEmail).toHaveBeenCalled();
  });

  describe('loginUser', () => {
    beforeEach(() => {
      jest
        .spyOn(jwtService, 'generateAuthTokenPair')
        .mockImplementation(() => tokenPair);
    });

    it('should login user by email correctly', async () => {
      const data: AuthLoginDto = {
        login: user.email,
        password: user.password,
      };
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
        password: 'incorrect',
      };

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

  describe('requestPasswordReset', () => {
    it('should reset password correctly', async () => {
      await authService.requestPasswordReset({ email });

      expect(userRepository.findByEmail).toBeCalledWith(email);
      expect(jwtService.generateResetPasswordToken).toBeCalledWith(user.id);
      expect(emailService.sendResetPasswordEmail).toBeCalled();
    });

    it("should throw error if user doesn't exists", async () => {
      userRepository.findByEmail.mockResolvedValueOnce(undefined);
      expect.assertions(2);

      try {
        await authService.requestPasswordReset({ email });
      } catch (e) {
        expect(userRepository.findByEmail).toBeCalledWith(email);
        expect(e.message).toEqual('User not found');
      }
    });
  });

  describe('resetUsersPassword', () => {
    const newPassword = 'testNewPassword';
    const mockToken = 'token';

    it('should reset user password', async () => {
      jest
        .spyOn(jwtService, 'verifyPasswordResetToken')
        .mockImplementationOnce(() => ({ userId: user.id }));
      await authService.resetUsersPassword(mockToken, newPassword);

      expect(jwtService.verifyPasswordResetToken).toBeCalledWith(mockToken);
      expect(passwordHashService.hash).toBeCalledWith(newPassword, 12);
      expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(user.id, {
        password: newPassword,
        passwordVersion: user.passwordVersion + 1,
      });
    });

    it('should throw error if token is invalid', async () => {
      jest
        .spyOn(jwtService, 'verifyPasswordResetToken')
        .mockImplementationOnce(() => {
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
    const mockToken = 'mockToken';

    it('should refresh token correctly', async () => {
      jest
        .spyOn(jwtService, 'verifyRefreshToken')
        .mockImplementationOnce(() => ({
          userId: user.id,
          passwordVersion: 1,
        }));
      jest
        .spyOn(jwtService, 'generateAuthTokenPair')
        .mockImplementation(() => tokenPair);

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

  describe('confirmEmail', () => {
    const mockToken = 'mockToken';

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
