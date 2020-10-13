import { SentMessageInfo } from 'nodemailer';
import emailTransporter from '../usecases/emailTransporter';
import renderConfirmationEmail from '../usecases/renderConfirmationEmail';
import config from 'config';
import renderResetPasswordEmail from '../usecases/renderResetPasswordEmail';

export default class EmailService {
  public static sendRegistrationEmail(
    to: string,
    confirmRegistrationUrl: string,
  ): Promise<SentMessageInfo> {
    return emailTransporter.sendMail({
      to,
      subject: 'Confirm Email',
      html: renderConfirmationEmail(
        config.get('appUrl'),
        confirmRegistrationUrl,
      ),
    });
  }

  public static sendResetPasswordEmail(
    to: string,
    resetPasswordUrl: string,
  ): Promise<SentMessageInfo> {
    return emailTransporter.sendMail({
      to,
      subject: 'Password reset',
      html: renderResetPasswordEmail(config.get('appUrl'), resetPasswordUrl),
    });
  }
}
