import { IEmailService } from '../../../services/EmailService';

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
