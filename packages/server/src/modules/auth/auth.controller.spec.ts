import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import userRepository from '../user/__mocks__/user.repository';
import emailService from '../common/email/__mocks__/email.service';
import jwtService from '../common/jwt/__mocks__/jwt.service';
import passwordHashService from '../common/password/__mocks__/password.service';
import config from '../../config';
import { TYPES } from '../../injectable.types';
import { PasswordHashService } from '../common/password/password.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

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

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TODO: Cover AuthController with tests
});
