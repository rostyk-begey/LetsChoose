import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import MockJwtService from '../../../test/mocks/services/jwt.service';
import MockEmailService from '../../../test/mocks/services/email.service';
import MockPasswordHashService from '../../../test/mocks/services/password.service';
import MockUserRepository, {
  mockUsers,
} from '../../../test/mocks/repositories/user.repository';
import config from '../../config';
import { TYPES } from '../../injectable.types';
import { PasswordHashService } from '../common/password/password.service';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.schema';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

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
          useValue: MockUserRepository,
        },
        {
          provide: TYPES.JwtService,
          useValue: MockJwtService,
        },
        {
          provide: TYPES.EmailService,
          useValue: MockEmailService,
        },
        {
          provide: TYPES.PasswordHashService,
          useValue: MockPasswordHashService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  const email = 'test@email.com';
  const username = 'test.username';
  const password = 'qwerty12345';
  let user: User;

  test('registerUser', async () => {
    await authService.registerUser({ email, username, password });
    user = await userRepository.findByEmail(email);

    expect(user.email).toEqual(email);
    expect(user.username).toEqual(username);
    expect(user.password).toEqual(password);
  });

  test('loginUser', async () => {
    const [user] = mockUsers;
    const { userId, accessToken, refreshToken } = await authService.loginUser({
      login: user.email,
      password: user.password,
    });
    const mockToken = MockJwtService.generateAccessToken({
      userId,
      passwordVersion: user.passwordVersion,
    });

    expect(userId).toEqual(user.id);
    // test('test userId', () => {});

    expect(accessToken).toEqual(mockToken);
    // test('test accessToken', () => {});

    expect(refreshToken).toEqual(mockToken);
    // test('test refreshToken', () => {
    // });

    expect(MockJwtService.generateAuthTokenPair).toBeCalledWith(
      userId,
      user.passwordVersion,
    );
    // test('test generateAuthTokenPair', () => {
    // });
  });

  test('requestPasswordReset', async () => {
    const [user] = mockUsers;
    await authService.requestPasswordReset({ email: user.email });

    // beforeAll(async () => {
    // });

    expect(MockJwtService.generateResetPasswordToken).toBeCalledWith(user.id);
    // test('test generateRefreshToken', () => {
    // });

    expect(MockEmailService.sendResetPasswordEmail).toBeCalled();
    // test('test sendResetPasswordEmail', () => {
    // });
  });

  test('resetUsersPassword', async () => {
    const [user] = mockUsers;
    const newPassword = 'testNewPassword';
    const mockToken = MockJwtService.generateEmailToken(user.id);
    await authService.resetUsersPassword(mockToken, newPassword);

    // beforeAll(async () => {
    //   resUser =
    // });

    expect(MockJwtService.verifyPasswordResetToken).toBeCalledWith(mockToken);
    // test('test verifyPasswordResetToken', () => {
    // });

    expect(MockPasswordHashService.hash).toBeCalledWith(newPassword, 12);
    // test('test hash password', () => {
    // });

    expect((await userRepository.findByEmail(user.email)).password).toEqual(
      newPassword,
    );
    // test('test new password', () => {
    // });

    expect(
      (await userRepository.findByEmail(user.email)).passwordVersion,
    ).toEqual(user.passwordVersion + 1);
    // test('test new passwordVersion', () => {
    // });
  });

  test('refreshToken', async () => {
    const user = await userRepository.findById(mockUsers[0].id);
    const mockToken = MockJwtService.generateRefreshToken({
      userId: user.id,
      passwordVersion: user.passwordVersion,
    });
    const {
      userId,
      accessToken,
      refreshToken,
    } = await authService.refreshToken(mockToken);

    expect(userId).toEqual(user.id);
    // test('test userId', () => {
    // });

    expect(accessToken).toEqual(mockToken);
    // test('test accessToken', () => {
    // });

    expect(refreshToken).toEqual(mockToken);
    // test('test refreshToken', () => {
    // });

    expect(MockJwtService.generateAuthTokenPair).toBeCalledWith(
      userId,
      user.passwordVersion,
    );
    // test('test generateAuthTokenPair', () => {
    // });
  });

  test('confirmEmail', async () => {
    const [user] = mockUsers;
    const mockToken = MockJwtService.generateEmailToken(user.id);

    await authService.confirmEmail(mockToken);
    // beforeAll(async () => {
    // });

    expect(MockJwtService.verifyEmailToken).toBeCalledWith(mockToken);
    // test('test verifyEmailToken', () => {
    // });

    expect(userRepository.findByIdAndUpdate).toBeCalledWith(user.id, {
      confirmed: true,
    });
    // test('test verifyEmailToken', () => {
    // });
  });
});
