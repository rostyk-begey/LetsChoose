/* eslint-disable @typescript-eslint/no-unused-vars */
import { Config } from '@lets-choose/api/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GmailConfig } from '@lets-choose/api/config';
import { IEmailService } from '../../../../abstract/src/lib/email.service.interface';

@Injectable()
export class EmailService implements IEmailService {
  private readonly config: GmailConfig;

  constructor(private readonly configService: ConfigService<Config>) {
    // TODO: update
    // @Inject() private readonly emailTransporter,
    this.config = configService.get('gmail', { infer: true });
  }

  public async sendRegistrationEmail(
    to: string,
    confirmRegistrationUrl: string,
  ): Promise<void> {
    // TODO: update
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
    // TODO: update
    // await this.emailTransporter.sendMail({
    //   to,
    //   subject: 'Password reset',
    //   html: resetPasswordUrl, //renderResetPasswordEmail(config.appUrl, resetPasswordUrl),
    // });
  }
}
