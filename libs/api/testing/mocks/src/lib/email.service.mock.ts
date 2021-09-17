import { IEmailService } from '@lets-choose/api/abstract';

export const emailServiceMock: jest.Mocked<IEmailService> = {
  sendRegistrationEmail: jest.fn().mockResolvedValue(undefined),
  sendResetPasswordEmail: jest.fn().mockResolvedValue(undefined),
};
