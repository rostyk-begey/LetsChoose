import { IPasswordHashService } from '../../../../../abstract/src/lib/password.service.interface';

const passwordService: jest.Mocked<IPasswordHashService> = {
  hash: jest.fn((password: string, salt) => Promise.resolve(password)),
  compare: jest.fn((hash1: string, hash2: string) =>
    Promise.resolve(hash1 === hash2),
  ),
};

export default passwordService;
