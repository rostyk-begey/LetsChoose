import { IPasswordHashService } from '../../../src/abstract/password.service.interface';

const PasswordService: IPasswordHashService = {
  hash: (password: string) => Promise.resolve(password),
  compare: (hash1: string, hash2: string) => Promise.resolve(hash1 === hash2),
};

PasswordService.hash = jest.fn(PasswordService.hash);
PasswordService.compare = jest.fn(PasswordService.compare);

export default PasswordService;
