import container from '../container';
import { TYPES } from '../../inversify.types';
import { IAuthService } from '../../services/AuthService';
import { IUserRepository } from '../../repositories/UserRepository';
import { User } from '../../models/User';

import PasswordHashService from '../__mocks__/services/PasswordHashService';
import JwtService from '../__mocks__/services/JwtService';
import EmailService from '../__mocks__/services/EmailService';
import UserRepository, {
  mockUsers,
} from '../__mocks__/repositories/UserRepository';

const authService: IAuthService = container.get<IAuthService>(
  TYPES.AuthService,
);

const userRepository = container.get<IUserRepository>(TYPES.UserRepository);

describe('Test AuthService registerUser', () => {
  const email = 'test@email.com';
  const username = 'test.username';
  const password = 'qwerty12345';
  let user: User;

  beforeAll(async () => {
    await authService.registerUser({ email, username, password });
    user = await userRepository.findByEmail(email);
  });

  test('test email', () => {
    expect(user.email).toEqual(email);
  });

  test('test username', () => {
    expect(user.username).toEqual(username);
  });

  test('test password', () => {
    expect(user.password).toEqual(password);
  });

  test('test password', () => {
    expect(PasswordHashService.hash).toBeCalledWith(password, 12);
  });
});

describe('Test AuthService loginUser', () => {
  const [user] = mockUsers;
  let userId: string;
  let accessToken: string;
  let refreshToken: string;
  let mockToken: string;

  beforeAll(async () => {
    ({ userId, accessToken, refreshToken } = await authService.loginUser(
      user.email,
      user.password,
    ));
    mockToken = JwtService.generateAccessToken({
      userId,
      passwordVersion: user.passwordVersion,
    });
  });

  test('test userId', () => {
    expect(userId).toEqual(user.id);
  });

  test('test accessToken', () => {
    expect(accessToken).toEqual(mockToken);
  });

  test('test refreshToken', () => {
    expect(refreshToken).toEqual(mockToken);
  });

  test('test generateAuthTokenPair', () => {
    expect(JwtService.generateAuthTokenPair).toBeCalledWith(
      userId,
      user.passwordVersion,
    );
  });
});

describe('Test AuthService requestPasswordReset', () => {
  const [user] = mockUsers;

  beforeAll(async () => {
    await authService.requestPasswordReset(user.email);
  });

  test('test generateRefreshToken', () => {
    expect(JwtService.generateResetPasswordToken).toBeCalledWith(user.id);
  });

  test('test sendResetPasswordEmail', () => {
    expect(EmailService.sendResetPasswordEmail).toBeCalled();
  });
});

describe('Test AuthService resetUsersPassword', () => {
  const [user] = mockUsers;
  let resUser: User;
  const newPassword = 'testNewPassword';
  const mockToken = JwtService.generateEmailToken(user.id);

  beforeAll(async () => {
    resUser = await authService.resetUsersPassword(mockToken, newPassword);
  });

  test('test verifyPasswordResetToken', () => {
    expect(JwtService.verifyPasswordResetToken).toBeCalledWith(mockToken);
  });

  test('test hash password', () => {
    expect(PasswordHashService.hash).toBeCalledWith(newPassword, 12);
  });

  test('test new password', () => {
    expect(resUser.password).toEqual(newPassword);
  });

  test('test new passwordVersion', () => {
    expect(resUser.passwordVersion).toEqual(user.passwordVersion + 1);
  });
});

describe('Test AuthService refreshToken', () => {
  let user: User;
  let userId: string;
  let accessToken: string;
  let refreshToken: string;
  let mockToken: string;

  beforeAll(async () => {
    user = await UserRepository.findById(mockUsers[0].id);
    mockToken = JwtService.generateRefreshToken({
      userId: user.id,
      passwordVersion: user.passwordVersion,
    });
    ({ userId, accessToken, refreshToken } = await authService.refreshToken(
      mockToken,
    ));
  });

  test('test userId', () => {
    expect(userId).toEqual(user.id);
  });

  test('test accessToken', () => {
    expect(accessToken).toEqual(mockToken);
  });

  test('test refreshToken', () => {
    expect(refreshToken).toEqual(mockToken);
  });

  test('test generateAuthTokenPair', () => {
    expect(JwtService.generateAuthTokenPair).toBeCalledWith(
      userId,
      user.passwordVersion,
    );
  });
});

describe('Test AuthService confirmEmail', () => {
  const [user] = mockUsers;
  const mockToken = JwtService.generateEmailToken(user.id);

  beforeAll(async () => {
    await authService.confirmEmail(mockToken);
  });

  test('test verifyEmailToken', () => {
    expect(JwtService.verifyEmailToken).toBeCalledWith(mockToken);
  });

  test('test verifyEmailToken', () => {
    expect(UserRepository.findByIdAndUpdate).toBeCalledWith(user.id, {
      confirmed: true,
    });
  });
});
