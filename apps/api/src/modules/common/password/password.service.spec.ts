import { Test, TestingModule } from '@nestjs/testing';
import { hash, compare } from 'bcryptjs';

import { PasswordHashService } from '@modules/common/password/password.service';

jest.mock('bcryptjs');
describe('PasswordHashService', () => {
  let passwordHashService: PasswordHashService;
  const password = 'password';
  const salt = 'salt';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHashService],
    }).compile();

    passwordHashService = module.get<PasswordHashService>(PasswordHashService);
  });

  test('hash', async () => {
    await passwordHashService.hash(password, salt);
    expect(hash).toHaveBeenCalledWith(password, salt);
  });

  test('compare', async () => {
    await passwordHashService.compare(password, password);
    expect(compare).toHaveBeenCalledWith(password, password);
  });
});
