import { IEmailService } from '../../../src/abstract/email.service.interface';

const EmailService: IEmailService = {
  sendRegistrationEmail: () => Promise.resolve(),
  sendResetPasswordEmail: () => Promise.resolve(),
};

EmailService.sendRegistrationEmail = jest.fn(
  EmailService.sendRegistrationEmail,
);
EmailService.sendResetPasswordEmail = jest.fn(
  EmailService.sendResetPasswordEmail,
);

export default EmailService;
