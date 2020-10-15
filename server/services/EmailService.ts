import { SentMessageInfo } from 'nodemailer';

import emailTransporter from '../usecases/emailTransporter';
import renderConfirmationEmail from '../usecases/renderConfirmationEmail';
import renderResetPasswordEmail from '../usecases/renderResetPasswordEmail';
import config from '../config';

export default class EmailService {
  public static sendRegistrationEmail(
    to: string,
    confirmRegistrationUrl: string,
  ): Promise<SentMessageInfo> {
    return emailTransporter.sendMail({
      to,
      subject: 'Confirm Email',
      html: renderConfirmationEmail(config.appUrl, confirmRegistrationUrl),
    });
  }

  public static sendResetPasswordEmail(
    to: string,
    resetPasswordUrl: string,
  ): Promise<SentMessageInfo> {
    return emailTransporter.sendMail({
      to,
      subject: 'Password reset',
      html: renderResetPasswordEmail(config.appUrl, resetPasswordUrl),
    });
  }
}
