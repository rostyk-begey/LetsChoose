import { IPasswordHashService } from '@lets-choose/api/abstract';

export const passwordHashServiceMock: jest.Mocked<IPasswordHashService> = {
  hash: jest.fn((password: string, salt) => Promise.resolve(password)),
  compare: jest.fn((hash1: string, hash2: string) =>
    Promise.resolve(hash1 === hash2),
  ),
};
