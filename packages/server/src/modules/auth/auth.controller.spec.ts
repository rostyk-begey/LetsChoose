import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import MockUserRepository from '../../../test/mocks/repositories/user.repository';
import MockEmailService from '../../../test/mocks/services/email.service';
import MockJwtService from '../../../test/mocks/services/jwt.service';
import MockPasswordHashService from '../../../test/mocks/services/password.service';
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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TODO: Cover AuthController with tests
});
