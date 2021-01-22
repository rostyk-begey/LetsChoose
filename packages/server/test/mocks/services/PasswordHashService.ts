import { IPasswordHashService } from '../../../src/abstract/password.service.interface';

const PasswordHashService: IPasswordHashService = {
  hash: (password: string) => Promise.resolve(password),
  compare: (hash1: string, hash2: string) => Promise.resolve(hash1 === hash2),
};

PasswordHashService.hash = jest.fn(PasswordHashService.hash);
PasswordHashService.compare = jest.fn(PasswordHashService.compare);

export default PasswordHashService;
