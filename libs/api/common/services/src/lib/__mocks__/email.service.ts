import { IEmailService } from '@lets-choose/api/abstract';

const emailService: jest.Mocked<IEmailService> = {
  sendRegistrationEmail: jest.fn().mockResolvedValue(undefined),
  sendResetPasswordEmail: jest.fn().mockResolvedValue(undefined),
};

export default emailService;
