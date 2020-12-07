import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GmailConfig } from '../../../../config';
import { IEmailService } from '../../../abstract/email.service.interface';

@Injectable()
export class EmailService implements IEmailService {
  private readonly config: GmailConfig;

  constructor(private readonly configService: ConfigService) {
    // @Inject() private readonly emailTransporter,
    this.config = configService.get<GmailConfig>('gmail');
  }

  public async sendRegistrationEmail(
    to: string,
    confirmRegistrationUrl: string,
  ): Promise<void> {
    // await this.emailTransporter.sendMail({
    //   to,
    //   subject: 'Confirm Email',
    //   html: confirmRegistrationUrl, //renderConfirmationEmail(config.appUrl, confirmRegistrationUrl),
    // });
  }

  public async sendResetPasswordEmail(
    to: string,
    resetPasswordUrl: string,
  ): Promise<void> {
    // await this.emailTransporter.sendMail({
    //   to,
    //   subject: 'Password reset',
    //   html: resetPasswordUrl, //renderResetPasswordEmail(config.appUrl, resetPasswordUrl),
    // });
  }
}
