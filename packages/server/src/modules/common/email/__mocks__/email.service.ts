import { IEmailService } from '../../../../abstract/email.service.interface';

const emailService: jest.Mocked<IEmailService> = {
  sendRegistrationEmail: jest.fn().mockResolvedValue(undefined),
  sendResetPasswordEmail: jest.fn().mockResolvedValue(undefined),
};

export default emailService;
