export interface IEmailService {
  sendRegistrationEmail(
    to: string,
    confirmRegistrationUrl: string,
  ): Promise<void>;
  sendResetPasswordEmail(to: string, resetPasswordUrl: string): Promise<void>;
}
